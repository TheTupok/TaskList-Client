import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Sort} from "@angular/material/sort";


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

  dataSource = new MatTableDataSource<ITask>(ELEMENT_DATA);
  columnsToDisplay = ['task', 'executor', 'deadline', 'dateOfCompleted', 'status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ITask | null;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
  }

  closeMembersList() {
    const contextMenu = document.getElementsByClassName('element-members-list') as HTMLCollection;
    Array.prototype.forEach.call(contextMenu, (elem) => {
      elem.classList.remove('visible');
    })
  }

  openMembersList(e: MouseEvent) {
    this.closeMembersList();

    const target = e.target as HTMLElement;
    const parent = target.closest('td') as HTMLElement;
    const contextMenu = parent.querySelector('.element-members-list') as HTMLElement;

    contextMenu.style.top = target.getBoundingClientRect().bottom - 2 + 'px';
    contextMenu.style.left = target.getBoundingClientRect().right - 2 + 'px';

    contextMenu.classList.add('visible');
  }

  handlePageEvent(e: PageEvent) {
    console.log(e);
  }

  sortChange(e: Sort) {
    console.log(e);
  }
}

export interface ITask {
  task: string;
  executor: string;
  members: string[];
  deadline: string;
  dateOfCompleted: string;
  status: string;
  description: string;
}

const ELEMENT_DATA: ITask[] = [
  {
    task: '1',
    executor: 'Egor',
    members: ['Hydrogen', '1'],
    deadline: '23.12.22',
    dateOfCompleted: '21.12.22',
    status: `Completed`,
    description: "Lorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adip"
  },
  {
    task: '2',
    executor: 'Anatoly',
    members: ['Oxygen', 'Gold', 'Hydrogen'],
    deadline: '23.12.22',
    dateOfCompleted: '21.12.22',
    status: `Work`,
    description: "Lorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adip"
  },
  {
    task: '3',
    executor: 'John',
    members: ['Gold', 'Hydrogen'],
    deadline: '23.12.22',
    dateOfCompleted: '21.12.22',
    status: `Work`,
    description: "Lorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adipLorem ipsum dolor sit amet, consectetur adip"
  },
];
