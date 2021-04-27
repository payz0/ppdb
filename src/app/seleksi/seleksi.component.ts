import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-seleksi',
  templateUrl: './seleksi.component.html',
  styleUrls: ['./seleksi.component.css']
})
export class SeleksiComponent implements OnInit {

  _datas:any
  amplop:boolean = false
  info:any = {}
  foto:string
  kertas:boolean = false
  dataSiswa:any = {}
  nisn:string = ''
  urutan:number
  nopes:string
  allData:any
  constructor(private _data:DataService) { }

  ngOnInit() {
    this._datas = this._data
    this.info = this._data.sekolah
    this.foto = this._data.baseUrl+"/images/"+this._data.sekolah.logo

    this.getDataSiswa()
  }

  getDataSiswa(){
    this._data.tampilData('siswa').subscribe((data)=>{
      this.allData = data
    })
  }
  submit(){
    if(this.info.reg_ulang){
      // this._data.tampilData('siswa').subscribe((data)=>{
        this.urutan = this.allData.sort((a,b)=>{return b.konfirm - a.konfirm || b.total - a.total || a.jarak - b.jarak}).findIndex((n)=>{ return  n.NoPes == this.nopes && n.nisn === this.nisn })+1
        let filtData =  this.allData.sort((a,b)=>{return b.konfirm - a.konfirm || b.total - a.total || a.jarak - b.jarak}).filter((n:any)=>{return  n.NoPes == this.nopes && n.nisn === this.nisn })
        console.log(this.urutan)
        // console.log(filtData.length)
        if(filtData.length == 1){
            this.dataSiswa = filtData[0]//data.filter((a)=>{return a.nisn === this.nisn && a.NoPes == this.nopes})[0]
            console.log(this.dataSiswa)
            this.kertas = true
            
        }else if(filtData.length < 1){
          this._data.pesan('NISN tidak terdaftar')
          this.nisn = ''
        }else{
          this._data.pesan('NISN terdeteksi lebih dari satu')
        }
        
      // })
    }else{
      this._data.pesan('Maaf saat ini belum saatnya pengumuman, tunggu pada waktu yang sudah di tentukan',10000)
      this.nisn =''
    }
    
  }

  mundur(){
    this._data.updateData({konfirm:false,ket:'Mengundurkan diri'},'siswa',this.dataSiswa._id).subscribe((data)=>{
      this._data.socket.emit('nambah siswa',Object.assign(data,{'indexSch':this._data.indexSch}))
      this.getDataSiswa()
      this.dataSiswa.konfirm = false
    })
  }
}
