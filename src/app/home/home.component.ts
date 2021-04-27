import { Component, OnInit, HostListener } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';
import { DataService } from '../service/data.service';

@Component({
	selector : 'app-home',
	templateUrl : './home.component.html',
	styleUrls : ['./home.component.css']
})

export class HomeComponent implements OnInit{
	title:String;
  siswas:any = [];
  _datas:any;
  cari:any = {nama:''}
  lebarLayar:number
     constructor(private _data:DataService){}
     
     ngOnInit(){
      // this._data.portRandom(1)
      this.tampilSiswa();
      this._data.socket.on('nambah array',(data)=>{
        if(data.indexSch == this._data.indexSch){
          this.siswas.unshift(data);
        }
      });
      this._datas = this._data;
      
     
     }
    //  untuk otomatis responsive
     @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.lebarLayar =  window.innerWidth
      }

     tampilSiswa(){
      this._data.tampilData('siswa').subscribe(
          (data)=>{
              // this._data.semuaSiswa = data;      
              this._data.dataArray = data;
            // data.reverse().forEach((val,key)=>{ di sortir dari besar ke kecil
            data.sort((a,b)=>{return a.NoPes - b.NoPes }).forEach((val,key)=>{
                  setTimeout(() => {
                      this.siswas.push(val);
                  }, 50*(key+1));
              })
          },
          (err)=>{
            this._data.pesan('ada kesalahan database');
          }
        )

     }

     cetakKartu(data){
      // alert(data._id);
      console.log(this.siswas.map(e=>{return e._id}).indexOf(data._id));
      
      
      this._data.dariHomeComponent = true;
      this._data.detail_siswa = data;
      this._data.detail_cetak = true;
      this._data.detail = true;
     }

}