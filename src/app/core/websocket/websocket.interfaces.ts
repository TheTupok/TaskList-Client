import {Observable} from 'rxjs';
import {IPageData} from '../services/paginator.service';


export interface IWebsocketService {
  on(): Observable<any>;

  send(data: IWsMessage): void;

  status: Observable<boolean>;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export interface IWsMessage {
  typeOperation: string,
  request?: any,
  response?: any,
  pageData?: IPageData
}
