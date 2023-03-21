import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "./services/chat/chat.service";
import {tap} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

export interface IMessage {
  user: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{

  @ViewChild('popup', {static: false}) popup: any;
  userList = [
    {
      id: 1,
      name: 'THAT guy',
      phone: '1111',
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
      phone: '2222',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '3333',
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
      phone: '4444',
      image: 'assets/user/user-4.png',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6',
      }
    },

  ]
  storageArray: any[] = []

  roomId: string = '';
  messageText: string = '';
  messageArray: IMessage[] = []

  phone: string = ''
  currentUser: any;
  selectedUser: any;
  showScreen = false;


  constructor(private chatService: ChatService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.chatService.getMessage().pipe(
      tap((data: IMessage) => {
        // this.messageArray.push(data)
        console.log(data, 'data');
        if (this.roomId) {
          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray.findIndex((storage: any) => storage.roomId === this.roomId)
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500)
        }
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  login(dismiss: any): void {
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter((user) => user.phone !== this.phone.toString())

    if (this.currentUser) {
      this.showScreen = true;
      dismiss();
    }
  }

  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex((storage: any) => storage.roomId === this.roomId)

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(user: string, room: string): void {
    this.chatService.joinRoom({user, room})
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    })

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex((storage: any) => storage.roomId === this.roomId)

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      })
      this.messageArray = this.storageArray[storeIndex].chats;
    } else {
      const updatedStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      this.messageArray = updatedStorage.chats;
      this.storageArray.push(updatedStorage)
    }

    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }


}
