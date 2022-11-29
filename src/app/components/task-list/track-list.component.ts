import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Sort} from "@angular/material/sort";
import {Observable, Subscription} from "rxjs";
import {IWsMessage, WebSocketService} from "../../core/websocket";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DateService} from "../../core/services/convertDate.service";


export interface ITask {
  id: number;
  taskName: string;
  executor: string;
  members: string[] | string;
  deadline: string;
  dateOfCompleted: string;
  status: string;
  description: string;
}


@Component({
  selector: 'app-task-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TaskListComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public formEditTask: FormGroup;

  dataSource = new MatTableDataSource<ITask>();
  columnsToDisplay = ['taskName', 'executor', 'deadline', 'dateOfCompleted', 'status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ITask | null;

  taskList: ITask[];

  editIdTask = 0;

  private message$: Observable<IWsMessage>;
  private _subscriptionMessage$: Subscription;

  private status$: Observable<boolean>;
  private _subscriptionStatus$: Subscription;

  constructor(private wsService: WebSocketService,
              private fb: FormBuilder,
              public dateService: DateService) {
  }

  ngOnInit() {
    this._createFormEditTask();

    this.message$ = this.wsService.on();
    this._subscriptionMessage$ = this.message$.subscribe(data => {
      this.wsMessageHandler(data);
    })

    if (this.wsService.isConnected) {
      this.wsService.send({ typeOperation: 'getTaskList' })
    }

    this.status$ = this.wsService.status;
    this._subscriptionStatus$ = this.status$.subscribe(status => {
      if (status) {
        this.wsService.send({ typeOperation: 'getTaskList' })
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private _createFormEditTask() {
    this.formEditTask = this.fb.group({
      taskName: '',
      executor: '',
      deadline: '',
      dateOfCompleted: '',
      status: '',
      description: ''
    })
  }

  wsMessageHandler(data: IWsMessage) {
    const typeOperation = data.typeOperation;

    if (typeOperation == 'getTaskList') {
      data['response'].forEach((item: ITask) => {
        if (typeof item.members === "string") {
          item.members = JSON.parse(item.members)
        }
      })
      this.taskList = data['response'];
    }
  }

  openMembersList(e: Event) {
    this.closeMembersList();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const parent = target.closest('td') as HTMLElement;
    const contextMenu = parent.querySelector('.element-members-list') as HTMLElement;

    contextMenu.style.top = target.getBoundingClientRect().bottom - 2 + 'px';
    contextMenu.style.left = target.getBoundingClientRect().right - 2 + 'px';

    contextMenu.classList.add('visible');
  }

  closeMembersList() {
    const contextMenu = document.getElementsByClassName('element-members-list') as HTMLCollection;
    Array.prototype.forEach.call(contextMenu, (elem) => {
      elem.classList.remove('visible');
    })
  }

  editTask(element: ITask) {
    this.editIdTask = element.id;

    const dataTask = Object.fromEntries(Object.entries(element).filter(([key]) =>
      key != 'id' && key != 'members'
    ))
    dataTask['deadline'] = this.dateService.convertDate(dataTask['deadline']);
    this.formEditTask.setValue(dataTask);
  }

  saveChangesTask(members: string[]) {
    const editTask = this.formEditTask.getRawValue();
    editTask.id = this.editIdTask;
    editTask.members = members;

    this.wsService.send({ typeOperation: 'editTask', request: editTask });

    this.editIdTask = 0;
  }

  addMember(elementId: number, newMember: HTMLInputElement) {
    this.taskList.map((task: ITask) => {
      if (task.id == elementId && typeof task.members !== "string") {
        task.members.push(newMember.value);
      }
    })
    newMember.value = '';
  }

  deleteMember(elementId: number, member: string) {
    const editTask = this.taskList.find((task: ITask) => task.id == elementId) as ITask;
    this.taskList.map((item: ITask) => {
      if (item.id == elementId && typeof editTask.members !== "string") {
        item.members = editTask.members.filter(item => item != member);
      }
    })
  }

  cancelChangesTask() {
    this.editIdTask = 0;
    this.wsService.send({ typeOperation: 'getTaskList' })
  }

  toggleExpandElement(element: ITask, event: Event) {
    this.closeMembersList();
    if (this.editIdTask == 0) {
      this.expandedElement = this.expandedElement === element ? null : element;
      event.stopPropagation()
    }
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
  }

  sortChange(event: Sort) {
    console.log(event);
  }

  ngOnDestroy() {
    this._subscriptionStatus$.unsubscribe();
    this._subscriptionMessage$.unsubscribe();
  }
}
