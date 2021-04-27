import { Component, OnInit } from '@angular/core';
import { DataService  } from '../service/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  foto:string;
  constructor(private _data:DataService) { }

  ngOnInit() {
  	this.foto = this._data.baseUrl+"/export.jpeg";
  }

}
