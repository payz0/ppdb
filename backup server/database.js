let mongoose = require('mongoose');
let fs	     = require('fs');

mongoose.connect("mongodb://localhost:27017/ppdb",
	{ useNewUrlParser: true },
	(err)=>{
			if(err){
				console.log("not connect db");
			}else{
				console.log('connected db');
			}
	});

mongoose.set('useFindAndModify', false); //untuk menghilangkan warning saat update

let schSiswa = mongoose.Schema({
				NoPes:{type:Number,default:0},
				nama:String,
				sex:String,
				nisn:String,
				sekolah:String,
				tgl:Date,
				tempat:String,
				hp:String,
				alamat:String,
				agama:String,
				UpFoto:String,
				UpSertifikat:String,
				cetak:Boolean,
				konfirm:Boolean,
				koordinat:String,
				jarak:Number,
				zonasi:Number,
				prestasi:Number,
				raport:Number,
				total:Number,
				tgl_reg:Date,
				indexSch:Number,
				otherSch:Number,
				status:String,
			},{strict:false})

let schField = mongoose.Schema({
			   field_attr:String,
			   field_db:String,
			   indexSch:Number
})

let schAdmin = mongoose.Schema({
			   username:String,
			   password:String,
			   sekolah:String,
			   alamat:String,
			   provinsi:String,
			   kabupaten:String,
			   kota:String,
			   nama_pejabat:String,
			   jabatan:String,
			   nip:String,
			   tgl_ppdb:String,
			   email:String,
			   logo:String,
			   latar:String,
			   informasi:String,
			   kuota:Number,
			   open:Boolean,
			   koordinat:String,
			   warna:String,
			   reg_ulang:Boolean
})

let schSyarat = mongoose.Schema({
				syarat:String,
				indexSch:Number
})

let schZona  = mongoose.Schema({
			   jauh:Number,
			   point:Number,
			   indexSch:Number
})

let tabelSiswa 	= mongoose.model("tabelSiswa", schSiswa, "tabelSiswa");
let tabelField 	= mongoose.model("tabelField", schField, "tabelField");
let tabelAdmin 	= mongoose.model("tabelAdmin", schAdmin, "tabelAdmin");
let tabelSyarat = mongoose.model("tabelSyarat", schSyarat, "tabelSyarat");
let tabelZona	= mongoose.model("tabelZona", schZona, "tabelZona");

module.exports = {mongoose, tabelSiswa, tabelField, tabelAdmin, tabelSyarat, tabelZona}
