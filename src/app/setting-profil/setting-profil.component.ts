import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-profil',
  templateUrl: './setting-profil.component.html',
  styleUrls: ['./setting-profil.component.css']
})

export class SettingProfilComponent implements OnInit {
  admin:any = {}
  edit:boolean;
  file:File = null;
  back_foto:String;
  back_tomb:boolean = false;
  logo_tomb:boolean = false;
  logo_foto:String;
  foto_default:string = './assets/default.jpeg';
  warna:string = ""

  constructor(private _data:DataService, private _http:HttpClient) { }

  ngOnInit() {
  	this.edit = true;
  	this.dataAdmin();
    this._data.socket.on('profil berubah',(data)=>{
        if(data.indexSch == this._data.indexSch){
          this.back_foto = this._data.baseUrl+"/images/"+this._data.sekolah.latar;
          this.logo_foto = this._data.baseUrl+"/images/"+this._data.sekolah.logo;
        }
    })
  }


  update(){
  	this._data.updateData(this.admin,'admin',this.admin._id).subscribe(
  		(data)=>{
  			this.edit = true;
        this._data.pesan('data berhasil di rubah');
         this._data.sekolah = data.sekolah;
         this._data.socket.emit('rubah profil', {'indexSch':this._data.indexSch});
  		},(err)=>{
         this._data.pesan('ada kesalahan database');
  		})
  }

dataAdmin(){
  	 this._data.tampilData('admin').subscribe(
  		(data)=>{
  		this.admin = data[this._data.indexSch];
      this.back_foto = this._data.baseUrl+"/images/"+data[this._data.indexSch].latar;
      this.logo_foto = this._data.baseUrl+"/images/"+data[this._data.indexSch].logo;
  		},
  		(err)=>{
  			this._data.pesan('ada kesalahan database');
  		}

  		)
  }

// upload image
  background(event){
     this.file = <File>event.target.files[0];
     if(this.file != null){
        const reader = new FileReader();
        reader.onload = e => this.back_foto = reader.result;
        reader.readAsDataURL(this.file);
        this.back_tomb = true;
    }
  }

async upload(field){
    const dataFile = await new FormData();
    const id = await this.admin._id;
    this.back_tomb = false;
    this.logo_tomb = false;
    dataFile.append('image', this.file);//, this.back_upload);
    this._data.uploadFile('admin',field,'profil',id,dataFile).subscribe(
      (data)=>{
        // console.log('berhasil upload');
        this._data.pesan(field+" telah berubah")
        this._data.socket.emit('rubah profil', {'indexSch':this._data.indexSch});
        // this.dataAdmin();
      },(err)=>{
        // console.log('gagal upload');
        this._data.pesan('maaf ada kesalahan database')
      }
    )
  }

  logo(event){
     this.file = <File>event.target.files[0];
     // console.log(event.target.files[0])
     if(this.file != null){
        const reader = new FileReader();
        reader.onload = e => this.logo_foto = reader.result;
        reader.readAsDataURL(this.file);
        this.logo_tomb = true;
        // console.log(reader.result)
    }
  }

  berubahWarna(){
    // console.log(this.warna)
    this._data.updateData({warna:this.warna},'admin',this.admin._id).subscribe((data)=>{
      this._data.pesan('Ganti warna sukses');
    },(err)=>{
      this._data.pesan('Cek database');
    })
  }

}
