import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.css']
})
export class SettingFormComponent implements OnInit {
	field:String;
  datas:any = [];
  jarak:any = {};
  zonas:any = [];
  buntau:any = {};
  editTomb:boolean = false;
  sekolah:any = {};
  admins:any = [];
  updeter:boolean = false;
  _datas:any;
  constructor(private _data:DataService) { }

  ngOnInit() {
    this._datas = this._data
    this.tampilField();
    this.tampilCategory()
    this.tampilSekolah();
  }

  tambahField(){
    if(this.field != ''){
    	let db = this.field.replace(/\s+/g,'_');
      this._data.tambahData({field_attr:this.field,field_db: db},'field').subscribe(
        (data)=>{
          this.datas.unshift(data);
          this._data.pesan('Berhasil tambah field');
          // this.datas.reverse();
        },
        (err)=>{
          this._data.pesan('ada kesalahan database');
        })
    }
  	this.field = '';
  }

  tampilField(){
    this._data.tampilData('field').subscribe(
      (data)=>{
          this.datas = data.reverse();
      },
      (err)=>{
        this._data.pesan('ada kesalahan database');
      })
  }

 hapusField(id){
      this._data.siapHapus(id,'field',this.datas,'Anda yakin hapus data ini ?');
  }

  tambahCategory(){
    this._data.tambahData(this.jarak,'zona').subscribe((data)=>{
      this.tampilCategory()
      this._data.pesan("Zona sukses");
      this.jarak = {};

    },
    (err)=>{this._data.pesan('gagal, cek kesalahan')}
    )
  }

  tampilCategory(){
      this._data.tampilData('zona').subscribe((data)=>{
        this.zonas = data.sort((a,b)=>{return a.jauh - b.jauh });
      },(err)=>{
        this._data.pesan('gagal, cek kesalahan');
      })
  }

  pilih(event){
    this.zonas.forEach((val,key)=>{
      if(val._id == event.target.value){
        this.jarak = val;
      }
    })
    this.editTomb = true;
  }

  editCategory(){
    // console.log(this.jarak)
    this._data.updateData(this.jarak,'zona',this.jarak._id).subscribe(data=>{
      this._data.pesan('berhasil di rubah')
      // setTimeout(()=>{this.tampilCategory()},10);
      this.tampilCategory()
      this.editTomb = false;
      this.jarak = {};
    },err=>{
      this._data.pesan('Maaf ada kesalahan');
    })
  }

  hapusCategory(){
    this._data.hapusData('zona',this.jarak._id).subscribe(data=>{
      this._data.pesan('berhasil di rubah')
      this.tampilCategory();
      this.editTomb = false;
      this.jarak = {};
    },err=>{
      this._data.pesan('Maaf ada kesalahan');
    })
  }

  tambahSekolah(){
    this._data.tambahData(this.sekolah,'admin').subscribe((data)=>{
      this._data.pesan('Sekolah bertambah');
      this.sekolah = {};
      this.tampilSekolah()
    },(err)=>{
      this._data.pesan('ada kesalahan di database');
    })
  }

  tampilSekolah(){
    this._data.tampilData('admin').subscribe((data)=>{
      this.admins = data;
    })
  }

  hapusSekolah(x){
    this._data.hapusData('admin',x).subscribe(()=>{
      this.tampilSekolah();
      this._data.pesan('sekolah di hapus')
    },(err)=>{
      this._data.pesan('cek database error')
    })
  }

  editSekolah(x){
    this.sekolah = x;
  }

  rubahSekolah(){
    this._data.updateData(this.sekolah,'admin',this.sekolah._id).subscribe((data)=>{
      this._data.pesan('update sukses');
      this.sekolah = {};
    },(err)=>{
      this._data.pesan('update gagal');
    })
  }

}
