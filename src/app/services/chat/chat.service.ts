import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client'
import {Observable} from "rxjs";
import {IMessage} from "../../app.component";
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private url = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.url);
  }

  joinRoom(data): void {
    this.socket.emit('join', data);
  }

  sendMessage(data): void {
    this.socket.emit('message', data);
  }

  getMessage(): Observable<any> {
    return new Observable<IMessage>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect()
      }
    })
  }
}
