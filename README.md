# TrackList

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3. This application is a track list of tasks. Here you can add, modify and delete tasks

# How to start

npm install and npm run start will download and run the client

# Application features

In this application, you can completely change the task and see its description by clicking on it. There is also sorting by columns and a table paginator.
If the deadline time is greater than or equal to our time, then a notification appears in the form of an icon near this date. Also, if you change the task status to 'Complete', then the due date will be set automatically and the task cannot be changed later.

# Server connection

Communication with the server is done via websocket RxJs. The server must be located at ws://localhost:8080, but this address can be changed in the enviroment.ts project file
