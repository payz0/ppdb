import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

	 /// default settings
  mark:mapboxgl.Marker;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';//'mapbox://styles/mapbox/outdoors-v9';//'mapbox://styles/payzo/cjuk06i4u1r0j1fpg2uytl8og';
  lat:number    = parseFloat(this._data.sekolah.koordinat.split(", ",2)[1]);
  lng:number    = parseFloat(this._data.sekolah.koordinat.split(", ",2)[0]);
  lat1:number   = parseFloat(this._data.sekolah.koordinat.split(", ",2)[1]);
  lng1:number   = parseFloat(this._data.sekolah.koordinat.split(", ",2)[0]);

  constructor(private _data:DataService) { }

  ngOnInit() {
  	 if (!mapboxgl.supported()) {
  	 		this._data.mapError = true;
         alert('Chrome tidak support, tunggu reload peta, atau ganti ke Firefox');
        this._data.pesan('Tunggu... Reload peta');
	    } else {
	      this.buildMap();
	   }
  }


  // pilih salah satu detek alamat dari mapbox atau google api
  detectAlamatGoogle(lat,lng){
   this._data.alamatGoogle(lat,lng).subscribe((data)=>{
       this._data.getAlamat = data.results[0].formatted_address;
       // console.log(data.results[0].formatted_address);
       localStorage.setItem('alamat',data.results[0].formatted_address)
        new mapboxgl.Popup()
            .setLngLat([this.lng,this.lat])
            .setHTML(data.results[0].formatted_address)
            .addTo(this.map);
    })
  }

  detectAlamatMapBox(){
     this._data.alamatMapBox(this.lng,this.lat).subscribe((data)=>{
       this._data.getAlamat = data.features[0].place_name;
       localStorage.setItem('alamat',data.results[0].formatted_address)
       // console.log(data.features[0].place_name)
    })
  }

// create peta
  buildMap() {
     if (!mapboxgl.supported()) {
        this._data.mapError = true;
        alert('Chrome tidak support, tunggu reload peta, atau ganti ke Firefox');
        this._data.pesan('Tunggu... Reload peta');
      }

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 16,
      center: [this.lng, this.lat]
    });

    /// Add map controls
     this.map.addControl(new mapboxgl.NavigationControl());
     // marker smp
     new mapboxgl.Marker().setLngLat([this.lng1,this.lat1]).addTo(this.map)
     new mapboxgl.Popup({closeOnClick: false})
                .setLngLat([this.lng1, this.lat1])
                .setHTML("<b style='margin-top:-100px'>"+this._data.sekolah.sekolah+"</b>")
                .addTo(this.map);

     // buat marker
    //"<b>Posisi Alamat anda</b>";
     this.mark = new mapboxgl.Marker({ draggable : true}).setLngLat([this.lng,this.lat]).addTo(this.map);
     this.mark.on('dragend', ()=>{  
              this.lat = this.mark.getLngLat().lat;
              this.lng = this.mark.getLngLat().lng;
          
              this._data.jarak(this.lat1,this.lng1,this.mark.getLngLat().lat, this.mark.getLngLat().lng);
              this.detectAlamatGoogle(this.mark.getLngLat().lat,this.mark.getLngLat().lng);
              this._data.coord_lng = this.mark.getLngLat().lng;
              this._data.coord_lat = this.mark.getLngLat().lat;
          });

      //// Add Marker on Click
      this.map.on('click', (event) => {
        const coordinates = [event.lngLat.lng, event.lngLat.lat]
        if(coordinates){
           this.map.flyTo({
              center: coordinates
            })
        }   
        this.lng = event.lngLat.lng;
        this.lat = event.lngLat.lat;
        this.mark.on('click').setLngLat(coordinates).addTo(this.map);
        this._data.jarak(this.lat1,this.lng1,this.lat,this.lng);
        this.detectAlamatGoogle(event.lngLat.lat,event.lngLat.lng)
        this._data.coord_lng = event.lngLat.lng;
        this._data.coord_lat = event.lngLat.lat;
       
    })

  }


}
