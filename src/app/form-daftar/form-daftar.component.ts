import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
// import { formatDate } from "@angular/common";

@Component({
  selector: 'app-form-daftar',
  templateUrl: './form-daftar.component.html',
  styleUrls: ['./form-daftar.component.css']
})
export class FormDaftarComponent implements OnInit {
  registrasi:any = {};
  fields:any = [];
  halaman:number = 0;
  jumlah_field:number = 9;
  dari_field:number;
  sampai_field:number;
  pages:number = -1;
  jumlah_page:number;
  hiddenTombol:boolean = false;
  
  tombUpload:boolean = false;
  jalurPrestasi:string = "";
  jenisEfek:boolean = false;

  _datas:any;
  daftarKonfirm:boolean = false;
  prestasiKonfirm:boolean = false;
  fileFoto:File = null;
  url_foto:any;
  filePrestasi:File = null;
  url_prestasi:any;
  imgFoto:boolean = false;
  imgPrestasi:boolean = false;
  dataKosong:boolean = false;
  nisnDouble:boolean = false;
  inputDisabled:boolean = false;
  pesanNisn:string;
  jumNisn:number;
  globalNisn:number;
  // globalSiswa:number;
  globalId:string;
  disableTgl:boolean = false

  constructor(private _data:DataService) { }

  ngOnInit() {
  	    this.FieldBaru();
        this.registrasi.agama = '';
        this.dataPagination();
        this.tampilSiswa()
        this._datas = this._data;
        this._data.socket.on('nambah array',(data)=>{
          this.out_nisn();
          this.tampilSiswa()
        })
         
  }

  tampilSiswa(){
    this._data.tampilData('siswa').subscribe(
        (data)=>{
            this._data.dataArray = data;
            // console.log(this._data.dataArray.length);
        },
        (err)=>{
          this._data.pesan('ada kesalahan database');
        }
      )

   }

  offJenis(){
    this.jenisEfek = false;
  }

  cekJenis(){
        if(this.jalurPrestasi == ''){
          this.jenisEfek = true;
        }else if(this.jalurPrestasi == 'ya'){
          this.tombUpload = true;
          this.jenisEfek = false;
        }else{
          this.tombUpload = false;
          this.jenisEfek = false;
        }
  }

  zonasi(){
    this._data.tampilData('zona').subscribe((data)=>{
      data.forEach((val,key)=>{
        if(val.jauh < this._data.jarakPeta*1000){
          this.registrasi.zonasi = val.point
        }
      })
    })
  }

 dataPagination(){
      this.dari_field = this.pages * this.jumlah_field;
      this.sampai_field = Number(this.dari_field) + Number(this.jumlah_field);
  }

  konfirmPeta(){
      this.registrasi.alamat = localStorage.getItem('alamat');
      this.registrasi.koordinat = this._data.coord_lng+", "+this._data.coord_lat;
  }

  petaAlamat(){
      if(this.registrasi.alamat != null && this.registrasi.alamat.length < 6){
          this._data.showMap = true;
      }

      if(this._data.showMap){
        this.inputDisabled = true
      }else{
        this.inputDisabled = false
      }
  }

  next(){
    this.halaman++;
    this.registrasi.jarak = this._data.jarakPeta;
    this.registrasi.koordinat = this._data.coord_lng+", "+this._data.coord_lat;
    this.registrasi.total = 0;
    this.registrasi.konfirm = false;
    this.registrasi.tgl_reg = new Date();
    this.zonasi();
    if(this.halaman <= this.jumlah_page){
      this.pages++;
      this.dataPagination();
      this.hiddenTombol = false;
    }else{
      this.halaman = this.jumlah_page;
    }

     if(this.halaman == this.jumlah_page){
           this.hiddenTombol = true;
      }

    this.cekJenis();
  }

  prev(){
    this.tombUpload = false;
    this.halaman--;
    this.hiddenTombol = false;
    if(this.halaman >= 0){
      this.pages--;
      this.dataPagination();
    }else{
      this.pages = 0;
    }
    // console.log(this.registrasi)
  }


  daftar(){
      // for(let i = 0; 30 > i; i++ ){
            this._data.tambahData(this.registrasi,'siswa').subscribe(
              (data)=>{
              	// this._data.socket.emit('nambah siswa',data); memang gak di pakai
                this.registrasi = {};
                this._data.pesan('Anda berhasil mendaftar');
                this.registrasi.agama = '';
                this.pages = -1;
                this.halaman = 0;
                this.hiddenTombol = false;
                this.tombUpload = false;
                this.dataKosong = false;
                this.nisnDouble = false;
                // console.log(data)
                // console.log(data._doc)
                // this._data.updateData({NoPes:data.jum},'siswa',data._id).subscribe()
                //harus ada emit untuk refresh di sekolah lain
                if(this.globalNisn == 1){
                  this._data.updateData({'otherSch':this._data.indexSch},'siswa',this.globalId).subscribe((dat)=>{
                    setTimeout(()=>{
                      this._data.pesan('Anda berhasil mendaftar 2 sekolah')
                    },2000)
                  },(err)=>{
                    this._datas.pesan('maaf ada kesalahan DB')
                  })
                }

                // cek upload
                if(this.imgPrestasi && this.filePrestasi != null){                
                  this.upload('upFoto',data._id, this.fileFoto, 'fotoSiswa',
                    this.upload('upSertifikat',data._id, this.filePrestasi,'fotoSertifikat')
                  );           
                }else{
                    this.upload('upFoto',data._id, this.fileFoto, 'fotoSiswa');
                }
                // console.log(data);
               },
              (err)=>
               {
                this._data.pesan('ada kesalahan database');
               });
        // }
     }


async upload(field, id, file, jenis, callback = null){
    const dataFile = await new FormData();
    dataFile.append('image', file);
    this._data.uploadFile('siswa',field, jenis, id, dataFile).subscribe(
      (data)=>{
        // console.log('berhasil upload');
        // this._data.socket.emit('nambah siswa',data);
        if(this.imgPrestasi){
          callback;
          this.imgPrestasi = false;
          this.filePrestasi = null;
          // this._data.socket.emit('nambah siswa',data);
        }
        // else{
        //   this._data.socket.emit('nambah siswa',data);
        // }
        if(field == 'upFoto'){
          this._data.socket.emit('nambah siswa', Object.assign(data,{'indexSch':this._data.indexSch}));
        }
        this.imgFoto = false;
        this.fileFoto = null;
        this._data.pesan('Anda berhasil mendaftar');
      },(err)=>{
        // console.log('gagal upload');
      }
    )
  }

  konfirmKirim(){
    if(this.jalurPrestasi =='ya'){
      if(
        this.registrasi.nama == null ||
        this.registrasi.nisn == null ||
        this.registrasi.sex == null ||
        this.registrasi.sekolah == null ||
        this.registrasi.tgl == null ||
        this.registrasi.tempat == null ||
        this.registrasi.hp == null ||
        this.registrasi.alamat == null ||
        this.registrasi.agama == '' ||
        this.nisnDouble || !this.imgFoto || !this.imgPrestasi
      ){
        this.dataKosong = true;
        this._data.isiPesan = "Mohon di perbaiki dulu";
      }else{
        this.dataKosong = false;
        this._data.isiPesan = "Yakin data anda sudah benar";  
      }
    }else{
      if(
        this.registrasi.nama == null ||
        this.registrasi.nisn == null ||
        this.registrasi.sex == null ||
        this.registrasi.sekolah == null ||
        this.registrasi.tgl == null ||
        this.registrasi.tempat == null ||
        this.registrasi.hp == null ||
        this.registrasi.alamat == null ||
        this.registrasi.agama == '' ||
        this.nisnDouble ||
        !this.imgFoto
        ){
        this.dataKosong = true;
        this._data.isiPesan = "Mohon di perbaiki dulu";
      }else{
        this.dataKosong = false;
        this._data.isiPesan = "Yakin data anda sudah benar";  
      }
    }
    this.daftarKonfirm = true;
    
  }

  FieldBaru(){
      this._data.tampilData('field').subscribe(
        (data)=>{
          this.fields = data;
          this.jumlah_page = Math.ceil(data.length/this.jumlah_field);
        },(error)=>{
          this._data.pesan('ada kesalahan database');
        })

     }

  // prestasi(){
  //     this.tombUpload = true;
  //     this.daftarKonfirm = true;
  //     this.prestasiKonfirm = true;
  //     // this._data.isiPesan = "Jika anda melalui jalur prestasi maka silahkan upload berkas sertifikat prestasi yang di miliki";
  // }

  async uploadFoto(event){
    this.fileFoto = await <File>event.target.files[0];
    if(this.fileFoto.type.split('/')[0] == 'image'){
        if(this.fileFoto.size < 10000000){
          if(this.fileFoto != null){
            const reader = new FileReader();
            reader.onload = e => this.url_foto = reader.result;
            reader.readAsDataURL(this.fileFoto);
            this.imgFoto = true;
            // console.log(this.fileFoto.size);
        }
      }else{
        this._data.pesan("Kapasitas foto maximal 20 MB")
      }
    }else{
      this._data.pesan('Maaf terdeteksi bukan gambar')
    }
  }

 async  uploadPrestasi(event){
    this.filePrestasi = await <File>event.target.files[0];
    if(this.filePrestasi.type.split('/')[0] == 'image'){
      if(this.filePrestasi.size < 10000000){
        if(this.filePrestasi != null){
          const reader = new FileReader();
          reader.onload = e => this.url_prestasi = reader.result;
          reader.readAsDataURL(this.filePrestasi);
          this.imgPrestasi = true;
        }
      }else{
        this._data.pesan("Kapasitas foto maximal 20 MB")
      }
    }else{
      this._data.pesan('Maaf terdeteksi bukan gambar')
    }
  }


  out_nisn(){
    this.globalNisn = 0;
    // this.globalSiswa = 0;
    let indexSch:number;
    if(!isNaN(this.registrasi.nisn)){
      if(this.registrasi.nisn != null){
        // this.cek_nisn()
        if(this.registrasi.nisn.toString().length < 9 || this.registrasi.nisn.toString().length > 10 ){
          this.nisnDouble = true;
          this.pesanNisn = "Jumlah NISN tidak benar";
        }else if(this.jumNisn >= 1){
          this.nisnDouble = true;
          this.pesanNisn = "NISN sudah terdaftar";
        }else{ 
          this.nisnDouble = false;
          // get  value variabel double registrasi
            this._data.tampilDataAll('siswa').subscribe((data)=>{
              data.forEach((val,key)=>{
                if(val.nisn == this.registrasi.nisn){
                  this.globalNisn++
                  indexSch = val.indexSch;
                  this.globalId = val._id;
                }
              })
              if(this.globalNisn == 1){
                this.registrasi.otherSch = indexSch;
              }
            })
        }
      } //if utama

    }else{
      this.nisnDouble = true;
      this.pesanNisn = "NISN hanya berupa angka";
    }
    // console.log("global nisn "+this.globalNisn)
  }

  cek_nisn(){
   this.jumNisn = 0;
   this.nisnDouble = false;
    for(let i = 0 ; this._data.dataArray.length > i ; i++){
      if(this._data.dataArray[i].nisn == this.registrasi.nisn){
        this.jumNisn++;
      }
    }

    // this._data.da
  }

  tgl(event){
    
    if(isNaN(new Date(event.target.value).getMonth())){
      this._data.pesan('Type tanggal tidak benar')
      this.registrasi.tgl = null
      this.disableTgl = true 
      localStorage.setItem('94telyi',new Date().toString())
      this._data.maenHackel = true
    }
  }

}
