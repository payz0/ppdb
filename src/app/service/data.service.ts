import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import * as socketIo from 'socket.io-client';
// import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';


@Injectable()

export class DataService {
	indexSch:number = 0;
	baseUrl:String = "http://localhost:8001";
	// baseUrl:String = environment.smp1Http
	// baseUrl:String = environment.smp2Http
	// baseUrl:String = environment.smp11Http
	// baseUrl:String = environment.smp7Http

	private headers =
			  new HttpHeaders({
			    'Content-Type':  'application/json',
			    'Authorization': environment.ppdbToken
			  })

	classes:String;
	konfirmasi:String;
	isiPesan:String;
	sekolah:any = {};
	socket = socketIo(this.baseUrl);
	// variabel untuk koneksi dengan komponen lain
	konfirmHapus:any = {}; //definisi object dari komponen lain
	konfirmTabel:String; //definisi jenis tabel dari komponen lain
	dataArray:any = []; // defini data array dari komponen lain
	detail:boolean = false; //untuk aktifkan detail box siswa
	detail_cetak:boolean = false; // untuk dialog box konfirm cetak;
	cetak_kartu:boolean = false; // untuk cetak kartu
	detail_siswa:any = {}; //objek data siswa detail
	eksekusi_untuk:string;
	homeTrue:boolean; //untuk ganti route daftar atau beranda
	copyright:string = 'payzo | contact :+6285249426552';
	dariHomeComponent:boolean;
	dariTanyaComponent:boolean;
	chatOpen:boolean = true;
	chatAdmin:boolean = false;
	mapError:boolean = false;
	showMap:boolean = false;
	// peta variabel
	jarakPeta:number;
	getAlamat:string;
	coord_lng:number;
	coord_lat:number;
	petaKonfirm:boolean = false;
	statusAdmin:boolean = false;
	petaSiswa:boolean = false;
	// tahun setting
	tahunNow:Date = new Date();
  	tahunNext:Date = new Date(this.tahunNow.getFullYear()+ 1, this.tahunNow.getMonth(), this.tahunNow.getDate());
  	tahunAjaran = this.tahunNow.getFullYear()+ "/" + this.tahunNext.getFullYear();
	maenHackel:boolean = localStorage.getItem('94telyi') ? true:false
	
	constructor(private http:HttpClient){
		mapboxgl.accessToken = environment.mapbox.accessToken;
	}

// arus data
	tambahData(data,tabel){
		// this.portRandom(1)

		return this.http.post(this.baseUrl+"/data/"+tabel,Object.assign(data,{'indexSch':this.indexSch}),{headers:this.headers})
		.catch((err)=>{
			return Observable.throw(err);
		});
	}

	tampilDataAll(tabel){ //semua sekolah
		// this.portRandom(1)

		return this.http.get(this.baseUrl+"/data/"+tabel+"/999",{headers:this.headers})
		.catch((err)=>{
			return Observable.throw(err);
		})
	}

	tampilData(tabel, status = null){
		// this.portRandom(1)

		return this.http.get(this.baseUrl+"/data/"+tabel+"/"+this.indexSch+"/"+status,{headers:this.headers})
		.catch((err)=>{
			return Observable.throw(err);
		})
	}

	updateData(data,tabel,id){
		// this.portRandom(1)

		return this.http.put(this.baseUrl+"/data/"+tabel+"/"+id,data,{headers:this.headers})
		.catch((err)=>{
			return Observable.throw(err);
		})
	}

	hapusData(tabel,id){
		return this.http.delete(this.baseUrl+"/data/"+tabel+"/"+id,{headers:this.headers})
		.catch((err)=>{
			return Observable.throw(err);
		})
	}

	// upload foto
	uploadFile(tabel, field, gambar, id, data){
		return this.http.post(this.baseUrl+"/upload/"+tabel+"/"+field+"/"+id+"/"+gambar,data)
		.catch((err)=>{
			return Observable.throw(err);
		})
	}

	excel(tabel,status = null){
		window.open(this.baseUrl+"/asdAsadD322nsdk2213sDSsdf3sdfsd/"+tabel+"/"+this.indexSch+"/"+status, '_blank');
	}


// ==================================================================
// event event
// pesan setelah event
	pesan(teks,time = null){
	    this.classes = 'pesan animated bounceInRight';
	    this.isiPesan = teks;
	    setTimeout(()=>{this.classes = 'pesan animated bounceOutRight'},time == null ? 1500 : time); //hinge
  	}

// menampilkan dialog konfirmasi hapus
	cekKonfirmasi(pesan, untuk = null){
  		this.konfirmasi = 'konfirmasi animated bounceInDown';
  		this.isiPesan = pesan;
  		this.eksekusi_untuk = untuk;
  	}

// eksekusi untuk hapus data
	siapHapus(id,tabel,arr = null,pesan){
	  this.cekKonfirmasi(pesan);
      this.konfirmHapus = id;
      this.konfirmTabel = tabel;
      this.dataArray = arr;
	}

  	correct(){
	  		this.konfirmasi = 'blank animated fadeOut';
	  		this.hapusData(this.konfirmTabel,this.konfirmHapus._id).subscribe(
	        (data)=>{
	          let index = this.dataArray.indexOf(this.konfirmHapus);
	          this.dataArray.splice(index,1);
	          this.pesan('Data telah di hapus');
	        },(err)=>{
	          this.pesan('ada kesalahan database');
	        })
  	}

  	tutup(){
  		this.konfirmasi = 'blank animated fadeOut';
  	}


  	// jarak kilometer peta==============================
  	 radians(degrees) {
    	return degrees * Math.PI / 180;
	  };


	  jarak(asli_lat,asli_lng,tujuan_lat,tujuan_lng){
	    var R = 6371e3;
	    var lat1rad = this.radians(asli_lat);//this.lat1.toRadians();
	    var lat2rad = this.radians(tujuan_lat);//this.lat.toRadians();
	    var tatac = this.radians(tujuan_lat - asli_lat);//.toRadians();
	    var lontac = this.radians(tujuan_lng - asli_lng);//.toRadians();

	    var a = Math.sin(tatac/2) * Math.sin(tatac/2) +
	            Math.cos(lat1rad) * Math.cos(lat2rad) *
	            Math.sin(lontac/2) * Math.sin(lontac/2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	    var d = (R * c)/1000;
	    // alert(d+" Km");
	    this.jarakPeta = parseFloat(d.toFixed(3));//+" Km";
	    // console.log(this.kiloM);
	  }

	  // get alamat
	  alamatMapBox(lng,lat){
			return this.http.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+lng+","+lat+".json?access_token=pk.eyJ1IjoicGF5em8iLCJhIjoiY2p1MnU2cDA1MDljZjQzanRkN2tsYngyciJ9.wfPngSrOo056dQTBLuoYcw",{headers:this.headers})
			.catch((err)=>{
				return Observable.throw(err);
			})
	  }


	   alamatGoogle(lat,lng): Observable<any> {
	    	return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyA6yguXT9Axmq4YONkT7flSBv9kqKEv3wY")
	    	.catch((err)=>{
				return Observable.throw(err);
			})
	  	}

}
