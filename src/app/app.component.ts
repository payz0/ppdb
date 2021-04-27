import { Component, OnInit } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';
import { DataService } from './service/data.service';


@Component({
  selector: 'app-root',  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
routing:string = 'info';
sekolah:any={};
latar:string;
_datas:any;
_form:any;
btnActived:string;
tombolPeta:boolean = false;
allChat:any = [];
video:string;
playVideo:boolean = false;


  constructor(private _data:DataService){
    // this.getJSON().subscribe(data => {
    //   console.log(data.serverSMP1);
    //   this._data.baseUrl = data.serverSMP1
    //  });
  }
  
  ngOnInit() {
    this.routing = 'info'
    this.video = this._data.baseUrl+"/images/video.png";
    this._data.tutup();
    this.DataSekolah();
    this._datas = this._data;
    this._data.homeTrue = false;
    
    localStorage.removeItem('alamat');
    
    this._data.socket.on('chat terima',(datas)=>{
        this.allChat.push(datas);
        localStorage.setItem("dataChat",JSON.stringify(this.allChat));
    })

    this._data.socket.on('profil berubah',()=>{
      this.DataSekolah();
      this.latar = this._data.baseUrl+'/images/'+this._data.sekolah.latar;
    })
  } 



  tujuan(teks) {
    this.btnActived = '';
    this.routing = teks;
    this._data.tutup();
    this._data.detail = false; //untuk aktifkan detail box siswa
    this._data.detail_cetak = false; // untuk dialog box konfirm cetak;
    this._data.cetak_kartu = false; 
    this._data.homeTrue = false;
    this._data.dariHomeComponent = false;
    this._data.dariTanyaComponent = false;
    this._data.chatOpen = true;
    this._data.chatAdmin = false;
    this._data.detail_siswa= {};
    this._data.mapError = false;
    this._data.petaSiswa = false;
    this.playVideo = false;
    // console.log(this.routing);
    if(teks == 'reg'){
      this.btnActived = 'active';
    }

    if(teks == 'setting'){
      localStorage.removeItem('login_admin');
    }
    
    

  }

  DataSekolah(){
    this._data.tampilData('admin').subscribe(
      (data)=>{
       // console.log(data)
        this.sekolah = data[this._data.indexSch];
        this._data.sekolah = data[this._data.indexSch];
        this.latar = this._data.baseUrl+'/images/'+data[this._data.indexSch].latar;
      },(err)=>{
        this._data.pesan('ada kelasahan database');
      })
  }

  playVid(){
    this.playVideo = !this.playVideo
  }

}

