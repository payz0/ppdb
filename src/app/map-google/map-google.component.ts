import { Component, OnInit } from '@angular/core';
import { MapsAPILoader  } from '@agm/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrls: ['./map-google.component.css']
})
export class MapGoogleComponent implements OnInit {

  lat:number    = parseFloat(this._data.sekolah.koordinat.split(", ")[1]);
  lng:number    = parseFloat(this._data.sekolah.koordinat.split(", ")[0]);
  lat1:number   = parseFloat(this._data.sekolah.koordinat.split(", ")[1]);
  lng1:number   = parseFloat(this._data.sekolah.koordinat.split(", ")[0]);
  zoom: number  = 18;
  draggable:boolean = false;
  _datas:any;

 
  constructor(private _data:DataService) { }

  ngOnInit() {
    if(this._data.petaSiswa){
      this.lat1 = parseFloat(this._data.detail_siswa.koordinat.split(", ")[1]);
      this.lng1 = parseFloat(this._data.detail_siswa.koordinat.split(", ")[0]);
    }
    this._datas = this._data;	
  }

// pilih salah satu detek alamat dari mapbox atau google api
  detectAlamatGoogle(){
    this._data.alamatGoogle(this.lat,this.lng).subscribe((data)=>{
       this._data.getAlamat = data.results[0].formatted_address;
       // console.log(data.results[0].formatted_address);
       localStorage.setItem('alamat',data.results[0].formatted_address);
    })
  }

  detectAlamatMapBox(){
     this._data.alamatMapBox(this.lng,this.lat).subscribe((data)=>{
       this._data.getAlamat = data.features[0].place_name;
       localStorage.setItem('alamat',data.results[0].formatted_address);
    })
  }

  pilihPeta($event){
  	this.lat= $event.coords.lat;
  	this.lng= $event.coords.lng;
  	this.draggable = true;
  	// console.log($event);
  	this._data.jarak(this.lat1,this.lng1,this.lat,this.lng);
    this.detectAlamatGoogle();
    this._data.coord_lng = $event.coords.lng;
    this._data.coord_lat = $event.coords.lat;
  }

  // drag($event){
  // 	this.lat= $event.coords.lat;
  // 	this.lng= $event.coords.lng;
  // 	this.draggable = true;
  // 	console.log($event);
  // 	this._data.jarak(this.lat1,this.lng1,this.lat,this.lng)
  //   this.detectAlamatGoogle();
  // }


}
