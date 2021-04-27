import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-daftar-ulang',
  templateUrl: './daftar-ulang.component.html',
  styleUrls: ['./daftar-ulang.component.css']
})
export class DaftarUlangComponent implements OnInit {

  fields:any =[]
  // registrasi:any = {}
  getSiswa:any = {}
  cek:any = {}
  cekError:boolean = false;
  siapCetak:boolean = false
  editIndex:number = null
  tanggal:Date
  _datas:any
  foto:string
  allNisn:any = [];
  status_nopes:boolean = false;
  constructor(private _data:DataService) { }


  ngOnInit() {
  	this.FieldBaru()
    this._datas = this._data
    this.foto = this._data.baseUrl+"/images/"+this._data.sekolah.logo
    // this._data.baseUrl+"/images/"+data[this._data.indexSch].logo
    // this.cekNoPes()
  }

    FieldBaru(){
      this._data.tampilData('field').subscribe(
        (data)=>{
          this.fields = data;
        },(error)=>{
          this._data.pesan('ada kesalahan database');
        })

     }

  // cekNoPes(){
  //   this._data.tampilData('siswa').subscribe((data)=>{
  //     this.allNisn = data;
  //     console.log(this.allNisn)
  //   },(err)=>
  //   {
  //     console.log('ada error');
  //   })
  // }

  // out_nopes(){
  //   if(this.getSiswa.NoPes != null || this.getSiswa.NoPes == ''){

  //     for(let i = 0; this.allNisn.length > i; i++){
  //       if(this.allNisn[i].NoPes === this.getSiswa.NoPes){
  //         this._data.pesan('No peserta sudah ada, ganti');
  //         alert('no peserta sudah ada, di ganti')
  //         this.getSiswa.NoPes = '';
  //         this.status_nopes = true;
  //         console.log(this.allNisn[i].NoPes)
  //       }
        
  //     }
  //   }
  // }

  dataSiswa(get){
  		this.cekError = false
  		this._data.tampilData('siswa').subscribe((data)=>{
  		data.forEach((val)=>{
  			   if(val.konfirm){
	  				if(val.nisn == get.nisn && val.NoPes == get.nopes){
	  					console.log('ada data satu')
	  					this.getSiswa = val
	  					this.cekError = true
	  				}else{
		  				this.cek = {}
	  				}
  			   }
  			})
  		if(!this.cekError){
  				this._data.pesan('data tidak terdaftar')
  			}
  		},(error)=>{
  			this._data.pesan('server sedang mati')
  		})
  	}

  	editSiswa(x){
  		console.log(x)
  		this.editIndex = x;
  	}

  	kirim(){
  		// console.log(this.getSiswa)
    //   // await this.out_nopes();
    //   if(!this.status_nopes){
      		this.getSiswa.status = 'regis ulang'
      		this._data.updateData(this.getSiswa,'siswa',this.getSiswa._id).subscribe(()=>{
      			this._data.pesan('Berhasil daftar ulang')
            this.siapCetak = true;
            this.tanggal = new Date()
      		},(err)=>{
      			this._data.pesan('maaf gagal ada kesalahan')
      		})
      // }else{
      //   alert('Maaf nomor peserta masih kosong')
      //   this.status_nopes = false
      // }
  	}

    cetak(){
      (window as any).print();
    }
}
