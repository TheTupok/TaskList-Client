import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {Observable, Subscription} from "rxjs";
import {IWsMessage, WebSocketService} from "../../core/websocket";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DateService} from "../../core/services/date.service";
import {MemberListService} from "../../core/services/member-list.service";
import {ITask} from "../../models/ITask";
import {IPageData, PaginatorService} from "../../core/services/paginator.service";


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

export class TaskListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public formEditTask: FormGroup;

  columnsToDisplay = ['taskName', 'executor', 'deadline', 'dateOfCompleted', 'status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ITask | null;

  rowTaskValue: number;
  taskList: ITask[];

  editIdTask = 0;

  private paginatorData: IPageData;
  private paginatorData$: Observable<IPageData>;
  private _subscriptionPageData$: Subscription

  private message$: Observable<IWsMessage>;
  private _subscriptionMessage$: Subscription;

  private status$: Observable<boolean>;
  private _subscriptionStatus$: Subscription;

  constructor(private wsService: WebSocketService,
              private fb: FormBuilder,
              public dateService: DateService,
              private memberListService: MemberListService,
              private paginatorService: PaginatorService) {
  }

  ngOnInit() {
    this._createFormEditTask();

    this.message$ = this.wsService.on();
    this._subscriptionMessage$ = this.message$.subscribe(data => {
      this.wsMessageHandler(data);
    })

    if (this.wsService.isConnected) {
      this.wsService.send({ typeOperation: 'getRowValue' })
    }

    this.status$ = this.wsService.status;
    this._subscriptionStatus$ = this.status$.subscribe(status => {
      if (status) {
        this.wsService.send({ typeOperation: 'getRowValue' });
        this._subscriptionStatus$.unsubscribe();
      }
    })

    this.paginatorData$ = this.paginatorService.getPaginatorData();
    this._subscriptionPageData$ = this.paginatorData$.subscribe(data => {
      this.paginatorData = data;
      this.wsService.send({ typeOperation: 'getTaskList', pageData: data })
    })
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

    if (typeOperation == 'getRowValue') {
      this.rowTaskValue = data['response'];
      this.paginatorService.setPaginatorData({ pageIndex: this.paginator.pageIndex, pageSize: this.paginator.pageSize })
    }

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
    this.memberListService.openMembersList(e);
  }

  closeMembersList() {
    this.memberListService.closeMembersList();
  }

  addTask() {
    this.wsService.send({ typeOperation: 'newTask' })
    this.paginatorService.setPaginatorData(this.paginatorData);
  }

  editTask(element: ITask) {
    this.editIdTask = element.id;

    const dataTask = Object.fromEntries(Object.entries(element).filter(([key]) =>
      key != 'id' && key != 'members'
    ))
    dataTask['deadline'] = this.dateService.convertDate(dataTask['deadline']);
    this.formEditTask.setValue(dataTask);
  }

  deleteTask(elementId: number) {
    this.wsService.send({ typeOperation: 'deleteTask', request: elementId }
    );
    this.paginatorService.setPaginatorData(this.paginatorData);
  }

  saveChangesTask(members: string[]) {
    const editTask = this.formEditTask.getRawValue();
    editTask.id = this.editIdTask;
    editTask.members = members;

    this.wsService.send({ typeOperation: 'editTask', request: editTask });
    this.paginatorService.setPaginatorData(this.paginatorData);

    this.formEditTask.reset();
    this.editIdTask = 0;
  }

  addMember(elementId: number, newMember: HTMLInputElement) {
    this.taskList.map((task: ITask) => {
      if (task.id == elementId && typeof task.members !== "string" && newMember.value != '') {
        if (task.members) {
          task.members.push(newMember.value);
        } else {
          task.members = [newMember.value];
        }
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
    this.paginatorService.setPaginatorData(this.paginatorData);
    this.formEditTask.reset();
  }

  toggleExpandElement(element: ITask, event: Event) {
    this.closeMembersList();
    if (this.editIdTask == 0) {
      this.expandedElement = this.expandedElement === element ? null : element;
      event.stopPropagation()
    }
  }

  handlePageEvent(event: PageEvent) {
    this.paginatorService.setPaginatorData({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }


  sortChange(event: Sort) {
    console.log(event);
  }

  ngOnDestroy() {
    this._subscriptionStatus$.unsubscribe();
    this._subscriptionMessage$.unsubscribe();
  }
}
