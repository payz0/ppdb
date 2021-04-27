import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-setting-list-ulang',
  templateUrl: './setting-list-ulang.component.html',
  styleUrls: ['./setting-list-ulang.component.css']
})
export class SettingListUlangComponent implements OnInit {
 siswas:any = [];
  unsiswas:any = [];
  unik_unsiswa:any = [];
  datas:any = [];
  bg_warna:String;
  cek: any = { nama: '' }; //filter pipe
  juml_siswa:String;
  juml_konfirm:number = 0;
  pages:number = 0;
  juml_hal:number;
  juml_list:number = 10;
  dari_data:number = this.juml_list * this.pages;
  sampai_data:number = Number(this.dari_data) + Number(this.juml_list);
  Ascending:boolean = false;
  _datas:any;
  nilai_zonasi:number;
  buka:boolean ;

  constructor(private _data:DataService) { }

  ngOnInit() {
  	this.daftarSiswa();
  	 this._data.socket.on('nambah array',(data)=>{
  	 	// if(data.indexSch == this._data.indexSch){	        
         //  this.datas.unshift(data);
	        // this.juml_siswa = this.datas.length;
          this.daftarSiswa();
    	// }
     });
  	 this._data.socket.on('refresh',(data)=>{
  	 	if(data.indexSch == this._data.indexSch){
  	 		this.daftarSiswa();
  	 	}
  	 })
  	 this._datas = this._data;
     this.buka = this._data.sekolah.reg_ulang
  }

  urutSort(x){
  	this.Ascending = !this.Ascending;
  	this.sortir(x);
  }

  sortir(m){
  	if(this.Ascending){
  		this.datas.sort((a,b)=>{return a[m] - b[m] })
  	}else{
  		this.datas.sort((a,b)=>{return b[m] - a[m] })
  	}
  	// console.log(m)
  }

  jumlah(event){
  	this.juml_list = event.target.value;
  	this.daftarSiswa();
  	this.pagination(0);
  }

  pagination(n:number){
  	this.pages = n;
  	this.dari_data = this.juml_list * this.pages;
  	this.sampai_data = Number(this.dari_data) + Number(this.juml_list);
  	// console.log("dari :"+this.dari_data+" sampai :"+this.sampai_data);
  }

  counter(){
  	return new Array(this.juml_hal);
  }
// nanti di lanjut
  cekSemuaSiswa(local){
    let gotData:any = []
    this._data.tampilData('admin').subscribe((data)=>{
       local.forEach((val,key)=>{
          if(val.otherSch != null){
            Object.assign(val, {'lainSekolah':data[val.otherSch].sekolah})
            // console.log(val)
          }
          gotData.push(val)
        })
       // console.log(gotData)
       this.datas = gotData.sort((a,b)=>{return a.jarak - b.jarak });
      })

  }

  daftarSiswa(){
	  this._data.tampilData('siswa','regis').subscribe(
	  	  (data)=>{
	  	  	let jum_data:any = [];
		  	// this.datas = data.sort((a,b)=>{return b.total - a.total });
		  	this.juml_siswa = data.length;
		  	for(let i = 0; data.length > i; i++){
		  		if(data[i].konfirm){
		  			jum_data.push('komfirm');	  			
		  		}
		  	}
		  	this.juml_konfirm = jum_data.length;
		  	this.juml_hal = Math.ceil(data.length / this.juml_list);
		  	this.cekSemuaSiswa(data);

		  },
		  (error)=>{
		  	this._data.pesan('ada kesalahan database');
		  }
	  )
	}

pilih(event){
	if(event.target.checked){
    	this.siswas.push(event.target.value);
    }else{
    	this.bg_warna = '';
    	this.unsiswas.push(event.target.value);
    	let index = this.siswas.indexOf(event.target.value);
    	this.siswas.splice(index,1);
    }

  }


// not working
downloadExcel(){
	this._data.excel('siswa','regis');
}

// get point zonasi
getPointZonasi(x,id){
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
            this.nilai_zonasi = val.point;
            // return val.point;
              this._data.updateData({konfirm:true,total:0,raport:0,prestasi:0,zonasi:val.point},'siswa',id).subscribe(
                 (datas)=>{
                   this._data.pesan("Data sudah di konfirm");
                   this.daftarSiswa();
                 },(err)=>{
                   this._data.pesan("ada kesalahan database");
              })
          }
        }else{
          this.nilai_zonasi = 0;
          // return 0;
            this._data.updateData({konfirm:true,total:0,raport:0,prestasi:0,zonasi:0},'siswa',id).subscribe(
               (datas)=>{
                 this._data.pesan("Data sudah di konfirm");
                 this.daftarSiswa();
               },(err)=>{
                 this._data.pesan("ada kesalahan database");
            })
        }
        console.log(this.nilai_zonasi);
      })

  },(err)=>{this._data.pesan('ada kesalahan di database')});
}

async konfirm(){
	// cek data array unik
	 for(let i = 0; this.unsiswas.length > i ; i++){
	    if(this.unik_unsiswa.indexOf(this.unsiswas[i]) == -1){
		  await	this.unik_unsiswa.push(this.unsiswas[i]);
	    }
	}

	// uncek
	for(let n = 0; this.unik_unsiswa.length > n; n++){

		await	this._data.updateData({konfirm:false,total:0,raport:0,prestasi:0},'siswa',this.unik_unsiswa[n]).subscribe(
				(data)=>{
					this._data.pesan("konfirmasi telah dirubah");
					this.daftarSiswa();
				},(err)=>{
					this._data.pesan("ada kesalahan database");
				})
		// await this.daftarSiswa();
		}
	// cek
	for(let i = 0; this.siswas.length > i; i++){

    this.datas.forEach((val,key)=>{
      if(this.siswas[i] == val._id){
          this.getPointZonasi(val.jarak * 1000, this.siswas[i]);
      }
    })
	}
	this.unsiswas = [];
	this.siswas = [];
	this.unik_unsiswa = [];

	}

detailSiswa(id){
		// alert(id);
		this._data.detail_siswa = id;
		this._data.detail = true;
	}

  regis(){
    this.buka = !this.buka
    this._data.updateData({reg_ulang:this.buka},'admin',this._data.sekolah._id).subscribe(()=>{
      if(this.buka){
        this._data.pesan('Daftar ulang di buka')
      }else{
        this._data.pesan('Daftar ulang di tutup')
      }
      this._data.socket.emit('rubah profil' ,{'indexSch':this._data.indexSch});
    },(err)=>{
      this._data.pesan('server error')
    })

  }

}
