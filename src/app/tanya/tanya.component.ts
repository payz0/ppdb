import { Component, OnInit} from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-tanya',
  templateUrl: './tanya.component.html',
  styleUrls: ['./tanya.component.css']
})
export class TanyaComponent implements OnInit {

	allChat:any = [];
  allGuest:any = [];
	chat:string;
	_datas:any;
	siswaChat:any = {};
  dataChat:any = {};
	fotoSiswa: string = this._data.baseUrl+"/foto/";
  komenPosisi:boolean = false;
  
  constructor(private _data:DataService) { }

  ngOnInit() {
    // init dataArray on service
     this._data.tampilData('siswa').subscribe(
          (data)=>{
              this._data.dataArray = data;
          },(err)=>{
            this._data.pesan('ada kesalahan database')
          }
      )

    this._datas = this._data; 
    if(localStorage.getItem('guest') != null){
        this.allGuest = JSON.parse(localStorage.getItem('guest'))
    }

   
    // get data semua chat
  	if(localStorage.getItem('dataChat') != null ){
  		this.allChat = JSON.parse(localStorage.getItem('dataChat')) //array chat log       
  	}else{
      this._data.chatOpen = true;
    }

    this._data.socket.on('tambah',(data)=>{
      if(data.indexSch == this._data.indexSch){
        if(localStorage.getItem('guest') != null && this.allGuest.length < data.length){
          this.allGuest = data;
          localStorage.setItem('guest',JSON.stringify(data));
        }
      }      
    })

     if(localStorage.getItem('nisn') != null){
            setTimeout(()=>{this.siswaChat = JSON.parse(localStorage.getItem('nisn'))},100);
            this._data.chatOpen = false;
        }else{
              this._data.chatOpen = true;
        }

    // menerima pesan 
      this._data.socket.on('chat terima',(datas)=>{
        if(datas.indexSch == this._data.indexSch){
          console.log(datas)
          if(!this._data.chatAdmin){
              if(datas.nopes != this.siswaChat.NoPes){
                this.allChat.push(datas);
                this.notif();
                localStorage.setItem("dataChat",JSON.stringify(this.allChat));
              }
          }else{
              if(datas.nopes != '0123456789'){
                  this.allChat.push(datas);
                  this.notif();
                  localStorage.setItem("dataChat",JSON.stringify(this.allChat));
              }

          }
        }
      })


      // ada user baru masuk
      this._data.socket.on('login guest',(data)=>{
        if(data.indexSch == this._data.indexSch){
            this.allGuest.forEach((val,key)=>{
              if(val.nopes == data.nopes){
                this.allGuest.splice(key,1);
              }
            })
            this.allGuest.unshift(data);
            this.notif();
            localStorage.setItem('guest',JSON.stringify(this.allGuest));
            this.siswaChat = JSON.parse(localStorage.getItem('nisn'));
            this._data.socket.emit('nambah', Object.assign(this.allGuest,{'indexSch':this._data.indexSch}))
        }
      })

      this._data.socket.on('cekout',(data)=>{
        if(data.indexSch == this._data.indexSch){
          this.allGuest.forEach((val,key)=>{
            if(val.nopes == data.nopes){
              this.allGuest.splice(key,1);
              localStorage.setItem('guest',JSON.stringify(this.allGuest));
            }
          })
        }
        
        // console.log("out "+JSON.stringify(data))
      })
  }

  kirim(){
    let data:any = {};
  	if(this.chat != null){
      
      // console.log(this.siswaChat);
      if(this._data.chatAdmin){
        data = {'chat':this.chat, 
                'tgl':new Date(),
                'user':'admin',
                'nopes': '0123456789',
                'foto': this._data.baseUrl+"/images/user_profil.jpeg",
                'indexSch':this._data.indexSch
              }
          this.siswaChat['NoPes'] = '0123456789';      
      }else{
        data = {'chat':this.chat, 
                'tgl':new Date(),
                'user':'siswa', 
                'nama':JSON.parse(localStorage.getItem('nisn')).nama, 
                'nopes': JSON.parse(localStorage.getItem('nisn')).NoPes,
                'foto': this.fotoSiswa+JSON.parse(localStorage.getItem('nisn')).UpFoto,
                'indexSch':this._data.indexSch
              }  
        this.siswaChat = JSON.parse(localStorage.getItem('nisn'))
      }
      this.allChat.push(data);
      localStorage.setItem("dataChat",JSON.stringify(this.allChat));
      this._data.socket.emit('chat kirim', data);  
      this.chat = null;
      console.log(data)
  	}else{
    		this.beep();
  	}
  }

  beep(){
	  let audio = new Audio();
	  audio.src = this._data.baseUrl+"/audio/beep-07.wav";
	  audio.load();
	  audio.play();
  }

  notif(){
  	  let audio = new Audio();
	  audio.src = this._data.baseUrl+"/audio/to-the-point.mp3";
	  audio.load();
	  audio.play();
  }

  loginFirst(){
  		if(!localStorage.getItem('nisn') && this._data.chatOpen && !this._data.chatAdmin){
	  		 this._data.detail_cetak = true;
		     this._data.detail = true;
		     this._data.dariTanyaComponent = true;
         if(localStorage.getItem('dataChat') != null ){
            this.allChat = JSON.parse(localStorage.getItem('dataChat'))
          }
		   }
  }

  exitChat(){
    // let data = await {'nama':this.siswaChat.nama, 'nopes':this.siswaChat.NoPes, 'foto':this.siswaChat.UpFoto}
    // await this._data.socket.emit('guest logout',this.siswaChat)
    this._data.chatOpen = true;
    this.chat = '';
    this.allGuest.forEach((val,key)=>{
      if(val.nopes == this.siswaChat.NoPes){
        // console.log('cah '+JSON.stringify(val));
        // let index = this.allGuest.indexOf(val);
        // this.allGuest.splice(key,1);
        this._data.socket.emit('guest logout',Object.assign(val,{'indexSch':this._data.indexSch}));

        // localStorage.removeItem('nisn');
        this.allChat = [];
        this.siswaChat = {};
        this.allGuest = [];
        // localStorage.removeItem('guest');
      }
      // localStorage.setItem('guest',JSON.stringify(this.allGuest))
    })
     localStorage.removeItem('guest');
     localStorage.removeItem('nisn'); 
     localStorage.removeItem('dataChat');
     this.allChat = [];
     this.siswaChat = {};
     this.allGuest = [];
  }

}
