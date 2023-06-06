import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
import { SignalEvent } from './signal-event';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private _signalEvent: Subject<SignalEvent<any>>;
  private _openConnection: boolean = false;
  private _isInitializing: boolean = false;
  private _hubConnection!: HubConnection;
  public url: string = '';
  public hubMethod: string = '';
  public hubMethodParams: any;
  public handlerMethod: string = '';

  constructor() {
    this._signalEvent = new Subject<any>();
  }
  set setConnectionUrl(url: string) {
    this.url = url;
  }
  set setHubMethod(hubMethod: string) {
    this.hubMethod = hubMethod;
  }
  set setHubMethodParams(hubMethodParams: string) {
    this.hubMethodParams = hubMethodParams;
  }
  set setHandlerMethod(handlerMethod: string) {
    this.handlerMethod = handlerMethod;
  }
  getDataStream<TData>(): Observable<SignalEvent<TData>> {
    this._ensureConnection<TData>();
    return this._signalEvent.asObservable();
  }
  private _ensureConnection<TData>() {
    if (this._openConnection || this._isInitializing) return;
    this._initializeSignalR<TData>();
  }
  private _initializeSignalR<TData>() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.url,
        {
          headers: { "ngrok-skip-browser-warning": "any"},
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
      .build();
    this._hubConnection.start()
      .then(_ => {
        this._openConnection = true;
        this._isInitializing = false;
        this._hubConnection.invoke(this.hubMethod,
          this.hubMethodParams)
        this._setupSignalREvents<TData>()
      })
      .catch(error => {
        console.warn(error);
        this._hubConnection.stop().then(_ => {
          this._openConnection = false;
          this._ensureConnection();
        })

      });

  }
  private _setupSignalREvents<TData>() {
    this._hubConnection.on(this.handlerMethod, (data) => {
      this._onMessage<TData>({ data })
    })
    this._hubConnection.onclose((e) => this._openConnection = false);
  }

  private _onMessage<TData>(payload: SignalEvent<TData>) {
    this._signalEvent.next(payload);
  }

}
