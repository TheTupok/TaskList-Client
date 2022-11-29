import {Inject, Injectable, OnDestroy} from '@angular/core';
import {interval, Observable, Observer, Subject, SubscriptionLike} from 'rxjs';
import {WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';

import {distinctUntilChanged, share, takeWhile} from 'rxjs/operators';
import {IWebsocketService, IWsMessage, WebSocketConfig} from './websocket.interfaces';
import {config} from './websocket.config';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService implements IWebsocketService, OnDestroy {

  private readonly config: WebSocketSubjectConfig<IWsMessage>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;

  private reconnection$: Observable<number> | null;
  private websocket$: WebSocketSubject<IWsMessage> | null;
  private connection$: Observer<boolean>;
  private readonly wsMessages$: Subject<IWsMessage>;

  private reconnectInterval: number;
  private readonly reconnectAttempts: number;
  public isConnected: boolean;


  public status: Observable<boolean>;

  constructor(@Inject(config) private wsConfig: WebSocketConfig) {
    this.wsMessages$ = new Subject<IWsMessage>();

    this.reconnectInterval = wsConfig.reconnectInterval || 5000;
    this.reconnectAttempts = wsConfig.reconnectAttempts || 10;

    this.config = {
      url: wsConfig.url,
      closeObserver: {
        next: () => {
          this.websocket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: () => {
          console.log('WebSocket connected!');
          this.connection$.next(true);
        }
      }
    };

    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    this.statusSub = this.status
      .subscribe((isConnected) => {
        this.isConnected = isConnected;

        if (!this.reconnection$ && !isConnected) {
          this.reconnect();
        }
      });

    this.websocketSub = this.wsMessages$.subscribe(
      null, (error: ErrorEvent) => console.error('WebSocket error!', error)
    );

    this.connect();
  }

  ngOnDestroy(): void {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }

  private connect(): void {
    this.websocket$ = new WebSocketSubject(this.config);

    this.websocket$.subscribe(
      (message) => this.wsMessages$.next(message),
      () => {
        if (!this.websocket$) {
          this.reconnect();
        }
      });
  }


  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval)
      .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

    this.reconnection$.subscribe(
      () => this.connect(),
      null,
      () => {
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.wsMessages$.complete();
          this.connection$.complete();
        }
      });
  }

  public on(): Observable<any> {
    return this.wsMessages$;
  }

  public send(data: IWsMessage): void {
    if (this.isConnected) {
      this.websocket$?.next(data);
    } else {
      console.error('Send error!');
    }
  }
}
