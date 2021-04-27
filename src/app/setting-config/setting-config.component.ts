import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-setting-config',
  templateUrl: './setting-config.component.html',
  styleUrls: ['./setting-config.component.css']
})
export class SettingConfigComponent implements OnInit {
 admin:any = {};
 edit:boolean;
 syarat:String;
 syarats:any = [];
 // lng:number;
 // lat:number;
 // koord:any;


 @ViewChild('peta') petaElement: ElementRef;
  constructor(private _data:DataService) { }

  ngOnInit() {
  	this.edit = true;
  	this.dataConfig();
  	this.tampilSyarat();
    // this.koord = this._data.sekolah.koordinat.split(", ")
    // console.log(this._data.sekolah.koordinat.split(", ")[0])

  }

  out_peta(){
      this._data.statusAdmin = true;
       setTimeout(()=>{this.petaElement.nativeElement.focus()},0);
      if(this._data.coord_lng == undefined || this._data.coord_lng == null){
        this.admin.koordinat = '';//this._data.coord_lng+", "+this._data.coord_lat;  
      }else{
        setTimeout(()=>{this.admin.koordinat = this._data.coord_lng+", "+this._data.coord_lat},0)
      }
  }

  dataConfig(){
  	this._data.tampilData('admin').subscribe(
  		(data)=>{
  			this.admin = data[this._data.indexSch];
        if(data[this._data.indexSch].open){
          this.admin.open = 'true';
        }else{
          this.admin.open = 'false';
        }
  		},
  		(err)=>{
        this._data.pesan('ada kesalahan database');
  		}
  		)
  }

  updateConfig(){
  	this._data.updateData(this.admin,'admin',this.admin._id).subscribe(
  		(data)=>{
  			this.edit = true;
  			this.dataConfig()
        this._data.pesan('data telah di rubah');
        this._data.socket.emit('rubah profil' ,{'indexSch':this._data.indexSch});
  		},
  		(err)=>{
        this._data.pesan('ada kesalahan database');
  		})
  }

  addSyarat(){
  	this._data.tambahData({syarat:this.syarat},'syarat').subscribe(
  		(data)=>{
  			this.tampilSyarat();
  			this.syarat = '';
        this._data.pesan('Syarat telah di tambah');
  		},
  		(err)=>{
        this._data.pesan('ada kesalahan database');
  		})
  }

  deleteSyarat(id){
      this._data.siapHapus(id,'syarat',this.syarats,'Anda yakin hapus syarat ini ?');
  }

  tampilSyarat(){
  	this._data.tampilData('syarat').subscribe(
  		(data)=>{
  			this.syarats = data;
  		},
  		(err)=>{
        this._data.pesan('ada kesalahan database');
  		})
  }

  cekPeta(){
     if(this.admin.koordinat != null && this.admin.koordinat.length < 6){
          this._data.showMap = true;
      }
  }
}
