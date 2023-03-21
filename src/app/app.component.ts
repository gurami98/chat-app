import {Component, OnInit} from '@angular/core';
import {ChatService} from "./services/chat/chat.service";
import {tap} from "rxjs";

export interface IMessage {
  user: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public userList = [
    {
      id: 1,
      name: 'THAT guy',
      phone: '9876598765',
      image: 'assets/user/user-1.jpeg',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3',
      }
    },
    {
      id: 2,
      name: 'The Swag Coder',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-2',
        4: 'room-3',
      }
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6',
      }
    },
    {
      id: 4,
      name: 'Dianne Russel',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6',
      }
    },

  ]

  roomId: string = '';
  messageText: string = '';
  messageArray: IMessage[] = []

  phone: string = ''
  currentUser = this.userList[0];
  selectedUser: any;


  constructor(private chatService: ChatService) {
    this.chatService.getMessage().pipe(
      tap((data: IMessage) => this.messageArray.push(data))
    ).subscribe();
  }

  ngOnInit(): void {
    // this.selectUserHandler();
  }

  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.selectedUser.id];
    this.messageArray = [];

    this.join(this.currentUser.name, this.roomId);
  }

  join(user: string, roomId: string): void {
    this.chatService.joinRoom({user, roomId})
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      data: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    })

    this.messageText = '';
  }
}
