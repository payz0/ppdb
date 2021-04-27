import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
 info:any = {};
 syarats:any = [];
 _datas:any;
 foto:string;
  constructor(private _data:DataService) { }

  ngOnInit() {
  	// this.informasi();
  	this.syarat();
    this._datas = this._data;
    // console.log(this._data.sekolah)
    this.DataSekolah()
  }

  // informasi(){
  // 	this._data.tampilData('admin').subscribe(
  // 		(data)=>{
  // 			// return data[0];
  // 			this.info = data[this._data.indexSch];
  //       this.foto = this._data.baseUrl+"/images/"+data[this._data.indexSch].logo
  // 		},
  // 		(err)=>{
  // 			console.log('ada error di database');
  // 		})
  // }

  DataSekolah(){
    this._data.tampilData('admin').subscribe(
      (data)=>{
        this.info = this._data.sekolah
        this.foto = this._data.baseUrl+"/images/"+this._data.sekolah.logo
        this._data.sekolah = data[this._data.indexSch];
        // this.latar = this._data.baseUrl+'/images/'+data[this._data.indexSch].latar;
      },(err)=>{
        this._data.pesan('ada kelasahan database');
      })
  }


  syarat(){
  	this._data.tampilData('syarat').subscribe(
  		(data)=>{
  			// return data;
  			this.syarats = data;
  		},
  		(err)=>{
  			console.log('syarat ada error');
  		})
  }

}
