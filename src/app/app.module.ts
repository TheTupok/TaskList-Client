import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import { TaskListComponent } from './components/task-list/track-list.component';
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {ClickOutsideModule} from "ng4-click-outside";
import {WebsocketModule} from "./core/websocket";

import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatIconModule,
    ClickOutsideModule,
    WebsocketModule.config({
      url: environment.ws
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
