import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  
  target:String = 'profil';
  _datas:any;
  loginCondition:boolean;
  // allChat:any = [];
  admin:any = {};
  errorClass:boolean = false;

  constructor(private _data:DataService) { }

  ngOnInit() {
    this.cekAndUpdate()
    this._datas = this._data;
    // this.loginCondition = JSON.parse(localStorage.getItem('login_admin'));
    if(JSON.parse(localStorage.getItem('login_admin')) && localStorage.getItem('kode_sekolah') == this._data.sekolah._id){
      this.loginCondition = true;
    }else{
      this.loginCondition = false;
    }
    this._data.socket.on('chat terima',(datas)=>{
      if(datas.indexSch == this._data.indexSch){
        if(datas.user == 'siswa'){
          this.notif();
        }
      }
    })
   
    
  }

  notif(){
    let audio = new Audio();
    audio.src = this._data.baseUrl+"/audio/to-the-point.mp3";
    audio.load();
    audio.play();
  }

  setting(target){
  	this.target = target;
    this._data.tutup();
  }

  login(){
    // this.errorClass = false;
    if(this.admin.user == this._data.sekolah.username && this.admin.pass == this._data.sekolah.password){
      localStorage.setItem('login_admin', 'true')
      localStorage.setItem('kode_sekolah', this._data.sekolah._id);
      this.loginCondition = true;
      this._data.chatAdmin = true;
      this.admin = {};
    }else{
      this._data.pesan('Maaf username atau password salah');
      this.admin = {};
      this.errorClass = true;
      setTimeout(()=>{this.errorClass = false},2000);
    }
  }

  logOut(){
   localStorage.removeItem('login_admin');
   this.loginCondition = false;
   localStorage.removeItem('dataChat');
   localStorage.removeItem('kode_sekolah');
  }

  cekAndUpdate(){
    let unik = {}
    let newData = []

    this._data.tampilDataAll('siswa').subscribe((data)=>{
      // cek data siswa dobel sekaligus bikin array newdata
      data.forEach((val,i)=>{
        if(val.otherSch == undefined || val.otherSch == null || typeof(val.otherSch) == 'undefined'){
            if(typeof(unik[val.nisn]) == "undefined"){
              newData.push(val)
            }
            unik[val.nisn] = 0
        }
      })

      // cek perbandingan data array lama dengan newdata
      data.forEach((val,n)=>{
        for(var i = 0; newData.length > i; i++){
          if(newData[i].nisn == val.nisn && newData[i].indexSch != val.indexSch){
            this._data.updateData({'otherSch':newData[i].indexSch},'siswa',val._id).subscribe(()=>{
              // this._data.pesan('berhasil otherSch '+newData[i].indexSch);
              console.log('new update')
            })
            this._data.updateData({'otherSch':val.indexSch},'siswa',newData[i]._id).subscribe(()=>{
              // this._data.pesan('berhasil otherSch '+val.indexSch);
              console.log('new update')
            })
           }
        }
      })
      // console.log(newData)
    },(err)=>{
      this._data.pesan('database tidak konek')
    })
  }
}
