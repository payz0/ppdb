import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  _datas:any;
  nisnCetak:String;
  show_gambar:boolean = false;
  num_cetak:number = 0;
  nisnChat:string;
  // point:any = {}
  // zona:any = [];
  nilai:any = {};
  nisn_rev:boolean = false;
  aktif_simpan:boolean = false;
  edit_nopes:boolean = false;
  // simpan:boolean = false;
  // jarak:number;

  constructor(private _data:DataService) { }

  ngOnInit() {
  	this._datas = this._data;
    this.getPointZonasi(this._data.detail_siswa.jarak *1000);
    if(this._data.detail_siswa.zonasi == null || this._data.detail_siswa.raport == null ){
      this.nilai.raport = 0;
      this.nilai.prestasi = 0;
      this.nilai.total = 0;
      this.nilai.zonasi = 0;
    }else{
      this.nilai.raport = this._data.detail_siswa.raport
      this.nilai.prestasi = this._data.detail_siswa.prestasi
      this.nilai.total = this._data.detail_siswa.total
      this.nilai.zonasi = this._data.detail_siswa.zonasi
    }
    
  }

  getNilai(){
    // this.totalNilai = this.raport + this.prestasi + this.point;
    this.nilai.total = this.nilai.raport + this.nilai.prestasi + this.nilai.zonasi;
  }

  cetakKartu(){
  	if(this.nisnCetak == this._data.detail_siswa.nisn){
  		this._data.cetak_kartu = true;
  		this._data.detail_cetak = false;
  	}else{
  		this._data.pesan('Maaf NISN salah');
  		this._data.cetak_kartu = false;
  		this._data.detail_cetak = true;
  	}
  }

  print(){
    this.num_cetak++;
  	// window.print();
    (window as any).print();
    this._data.updateData({'cetak':true},'siswa',this._data.detail_siswa._id).subscribe(
      (data)=>{
        if(this.num_cetak <2){
          this._data.pesan('Cetak kartu sebanyak 2 kali');
        }else{
          this._data.pesan('Ok.. Sukses');
          this.num_cetak = 0;
          this._data.cetak_kartu = false;
          this._data.detail_cetak = false;
          this._data.detail = false;
        }
      },
      (err)=>{
        this._data.pesan('ada kesalahan database');
      }
      )
  }

  chatSiswa(){
    this._data.dataArray.forEach((val,key)=>{
      // console.log(val.nisn+" dan input: "+ this.nisnChat);     
      if(this.nisnChat == val.nisn){
          let data = {'nama': val.nama, 'nopes': val.NoPes, 'foto': this._data.baseUrl+"/foto/"+val.UpFoto,'indexSch':this._data.indexSch}
         this._data.detail_cetak = false;
         this._data.detail = false;
         this._data.dariTanyaComponent = false;
         this._data.chatOpen = false;
         localStorage.setItem("nisn", JSON.stringify(val))
         this._data.socket.emit('new chater',data)
         console.log('detail '+JSON.stringify(data));
      }
    })
    
    if(this._data.chatOpen){
      this._data.pesan('Maaf nisn tidak di temukan');
      this.nisnChat = '';
    }

  }

  getPointZonasi(x){
    let zona:any = [];
    this._data.tampilData('zona').subscribe((data)=>{
      // this.zona = [];
      for(let i = 0; data.sort((a,b)=>{return a.jauh - b.jauh}).length > i; i++){
        if(data[i].jauh > x){
          zona.push(i)
        }
      }

      data.sort((a,b)=>{return a.jauh - b.jauh}).forEach((val,key)=>{
        if(zona[0] != null){
          if(key == zona[0]){
            this.nilai.zonasi = val.point;
          }
        }else{
          this.nilai.zonasi = 0;
        }
      })

    },(err)=>{this._data.pesan('ada kesalahan di database')});
  }

 simpan(){
  this.aktif_simpan = false
  if(this.nilai.total != 0){
    this.nilai.konfirm = true;
  }
  // console.log(this.nilai)
    this._data.updateData(this.nilai,'siswa',this._data.detail_siswa._id).subscribe((data)=>{
      this._data.pesan('Sukses tersimpan')
      this._data.socket.emit('edit nilai', {'indexSch':this._data.indexSch});
    },(err)=>{
      this._data.pesan('Ada kesalahan database')
    })
 }

 updatePeta(){
    this._data.petaSiswa = false;
    this._data.jarak(parseFloat(this._data.sekolah.koordinat.split(", ")[1]),parseFloat(this._data.sekolah.koordinat.split(", ")[0]),this._data.coord_lat,this._data.coord_lng);
    this._data.updateData({koordinat:this._data.coord_lng+", "+this._data.coord_lat,jarak:this._data.jarakPeta,alamat:this._data.getAlamat},'siswa',this._data.detail_siswa._id).subscribe((data)=>{
      this._data.pesan('Koordinat sudah berubah')
      this._data.detail_siswa = data;
      this._data.socket.emit('edit nilai', {'indexSch':this._data.indexSch});
    },(err)=>{
      this._data.pesan('Ada kesalahan database')
    })
 }

   out_nopes(){
    this._data.tampilData('siswa').subscribe((data)=>{
      for(let i = 0; data.length > i; i++){
        if(data[i].NoPes === this.nilai.NoPes){
          alert('no peserta sudah ada mohon ganti');
          this.nilai.NoPes = ''
          this.aktif_simpan = true;
        }
      }
      
    },(err)=>
    {
      console.log('ada error');
    })
  }

}
