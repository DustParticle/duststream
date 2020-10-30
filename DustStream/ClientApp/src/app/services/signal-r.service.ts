import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr'

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  public updateProcedureExecutionStatusTriggered: EventEmitter<any> = new EventEmitter();
  public updateReleaseStatusTriggered: EventEmitter<any> = new EventEmitter();

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(window.location.origin + '/broadcastStatusHub')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Hub Connection started'))
      .catch(err => console.log('Error while starting hub connection: ' + err))
  }
  public addBroadcastStatusListener = () => {
    this.hubConnection.on('UpdateProcedureExecutionStatus', (projectName, procedureExecution) => {
      this.updateProcedureExecutionStatusTriggered.emit({ projectName, procedureExecution });
    });
    this.hubConnection.on('UpdateReleaseStatus', (release) => {
      this.updateReleaseStatusTriggered.emit(release);
    });
  }

  constructor() { }
}
