import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {CryptoService} from "../../services/crypto/crypto.service";
import {LocalDataService} from "../../services/local_data/local-data.service";
import {Router, RouterOutlet} from "@angular/router";
import {ChatComponent} from "../chat/chat.component";
import {SidebarServerComponent} from "../sidebar-server/sidebar-server.component";

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        NgForOf,
        ChatComponent,
        RouterOutlet,
        SidebarServerComponent,
        NgIf
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{

    chatPopupVisible = true;

    toggleChatPopup() {
      this.chatPopupVisible = !this.chatPopupVisible;
    }
    constructor(private cryptoService: CryptoService,private localDataService:LocalDataService,private router: Router) {
            this.cryptoService = cryptoService;
            this.localDataService = localDataService;
    }
    servers=[
        {"server_name":"Hololive"},
        {"server_name":"如龙频道"},
    ];
    data = {
        objects: [
            {
                user: {
                    user_nickname: "兎田ぺこら",
                    user_info: {"email": "woshishabi@gmail.com", "phone": "1145141919810"}
                },
            },
            {
                user: {
                    user_nickname: "白上フブキ",
                    user_info: {"email": "woshishabi@gmail.com", "phone": "1145141919810"}
                },
            }
        ]
    };
    getUserData(){
        const self = this;
        const socket = new WebSocket('ws://'+this.localDataService.serverAddress+'/ws/user/');
        socket.onopen = function () {
            const requestJson = {
                'command': 'get_user_data',
                'session_id': self.cryptoService.session,
            }
            socket.send(JSON.stringify(requestJson));
        }
        socket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
        socket.onmessage = function (e: { data: any; }) {
            const json = JSON.parse(e.data)
            console.log(json)
        };
    }

    ngOnInit(): void {
        this.getUserData();
    }

    previewImageUrl: string = ''; // 存储预览图像的URL
  // 打开文件选择对话框
  openFileInput() {
    document.getElementById('fileInput')?.click();
  }
  // 当文件被选中时触发
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // 获取选择的文件
    this.previewImage(file); // 调用预览图像方法
  }

  // 预览图像
  previewImage(file: File) {
      const reader = new FileReader(); // 创建文件读取器
      reader.onload = () => {
          const imgElement = document.getElementById('preview') as HTMLImageElement; // 获取图片元素
          imgElement.src = reader.result as string; // 将图像数据直接赋给图片元素的 src 属性
      };
      reader.readAsDataURL(file); // 读取文件
  }

    createServer() {
        const socket = new WebSocket('ws://'+this.localDataService.serverAddress+'/ws/server/');
            const requestJson = {
                'command': 'create_server',
                'server':{
                    'description': "傻逼",
                    'name': "hololive",
                    'session_id': this.cryptoService.session,
                    'is_private': true
                }
            }
            socket.onopen = function (){
                socket.send(JSON.stringify(requestJson));
            }
            socket.onmessage = function (e: { data: any; }) {
                const json = JSON.parse(e.data)
                console.log(json)
                // const command =    json.command;
                // if (command == "key_exchange"){
                //     const public_key = json.public_key;
                //     const session_id = json.session_id;
                //     console.log(public_key)
                //     self.cryptoService.setServerPublicKey(public_key);
                //     console.log(session_id)
                //     self.cryptoService.setSession(session_id);
                // }
                socket.close();
            };
    }
}
