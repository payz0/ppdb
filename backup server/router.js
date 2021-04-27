let express = require('express');
let app 	= express();
let jwt       = require('jsonwebtoken');
let path    = require('path');
let db 		= require('./database.js');
let sharp 	= require('sharp');
let fs 		= require('fs');
// let mv 		= require('mv');

let tabel;
let arr  = [];
//// coba excel
var xl = require('excel4node');
//var wb = new xl.Workbook();
//var ws = wb.addWorksheet('Sheet 1');
//var style1 = wb.createStyle({
//		  font: {
//		    color: 'blue',
//		    size: 12,
//		  },
//		  alignment: {
//		    wrapText: true,
//		    horizontal: 'center',
//		  },
		  // numberFormat: '$#,##0.00; ($#,##0.00); -',
//		});
//var style2 = wb.createStyle({
//		  font: {
//		    color: 'black',
//		    size: 14,
//		  },
//		  alignment: {
//		    wrapText: true,
//		    horizontal: 'center',
//		  },
		  // numberFormat: '$#,##0.00; ($#,##0.00); -',
//		});

function schema(x){
	switch(x){
		case "siswa":
			tabel = db.tabelSiswa;
			break;
		case "field":
			tabel = db.tabelField;
			break;
		case "admin":
			tabel = db.tabelAdmin;
			break;
		case "syarat":
			tabel = db.tabelSyarat;
			break;
		case "zona":
			tabel = db.tabelZona;
			break;
		default:
		break;
	}
}

// uji coba menghitung jumlah siswa
// app.get("/", (req, res)=>{
// 	db.tabelSiswa.countDocuments({},(err,count)=>{
// 		console.log('jumlah data siswa '+count);
// 	})
// })

function verifyToken(req,res,next){
	const getHeader = req.headers['authorization']
	
	if(typeof getHeader  !== 'undefined'){
		const bearer = getHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken
		next()
	}else{
		//res.sendStatus(403)
		res.sendFile(__dirname+'/bejo.html')
	}
}

app.get('/', (req,res)=>{
	res.sendFile(__dirname+'/bejo.html')
})

// tampil data
app.get('/data/:tabel/:ind?/:status?',verifyToken, (req,res)=>{
    schema(req.params.tabel);
    let datas;
	if(req.params.status == 'regis'){
		datas = {indexSch:req.params.ind, status:'regis ulang'}
	}else{
		datas = {indexSch:req.params.ind}
	}
    jwt.verify(req.token,'ppdbKeys',(err, authData)=>{
      if(err){res.sendStatus(403)}else{
	if(req.params.tabel == 'admin' || req.params.ind == 999){
		tabel.find({}, (err, docs)=>{
			if(err) throw err;
			res.json(docs);
		});
	}else{
		tabel.find(datas, (err, docs)=>{
			if(err) throw err;
			res.json(docs);
		});
	}
     }})
})

// input data
app.post('/data/:tabel',verifyToken, (req,res)=>{
  schema(req.params.tabel);
  jwt.verify(req.token,'ppdbKeys',(err, authData)=>{
    if(err){res.sendStatus(403)}else{
	if(req.params.tabel == 'siswa'){
		tabel.create(req.body,(err,docs)=>{
			if(err) throw err;
			// tabel.countDocuments({},(err,count)=>{ //update nomer peserta increatmen
				tabel.find({indexSch:docs.indexSch})
					.sort({NoPes : -1})
					.limit(1)
					.exec(function(err, doc){
				     console.log("nilai akhir : "+doc[0].NoPes);
					 let urutan = doc[0].NoPes;
						tabel.findOneAndUpdate({_id:docs._id},{ $set: { konfirm: false } },{new:true},(err,docs)=>{
						if(err) throw err;
						if(urutan == 'undefined' || urutan == null ||  urutan == undefined){
							urutan == doc[0].NoPes
							tabel.findOneAndUpdate({_id:docs._id},{ $inc: { NoPes: urutan + 1 } },{new:true},(err,docs)=>{
                                                        if(err) throw err;
                                                                res.json(docs);
                                                         })
                                              
						}else{
						     tabel.findOneAndUpdate({_id:docs._id},{ $inc: { NoPes: urutan + 1 } },{new:true},(err,docs)=>{
                                                	if(err) throw err;
                                                        	res.json(docs);
                                               		 })
						}
						})
						
					//	tabel.findOneAndUpdate({_id:docs._id},{ $inc: { NoPes: urutan + 1 } },{new:true},(err,docs)=>{
					//	if(err) throw err;
						//	res.json(docs);
						//})
					// }	
				})	
			// })
			console.log('berhasil tambah');
		})
	}else{
		tabel.create(req.body,(err,docs)=>{
			if(err) throw err;
			res.json(docs);
			console.log('berhasil tambah '+docs);
		})
	}
	console.log(req.body);
   }})
})

// edit data
app.put('/data/:tabel/:id',verifyToken, (req,res)=>{
  schema(req.params.tabel);
  jwt.verify(req.token,'ppdbKeys',(err, authData)=>{
    if(err){res.sendStatus(403)}else{
	tabel.findOneAndUpdate({_id:req.params.id},{$set:req.body},{new:true},(err,docs)=>{
		if(err) throw err;
		res.json(docs);
		console.log('berhasil update ');
	})
    }})
})

// hapus data
app.delete('/data/:tabel/:id',verifyToken, (req,res)=>{
   schema(req.params.tabel);
  jwt.verify(req.token,'ppdbKeys',(err, authData)=>{
    if(err){res.sendStatus(403)}else{
	tabel.findOneAndDelete({_id:req.params.id}, (err,docs)=>{
		if(err) throw err;
		res.json(docs);
		// console.log('delete '+docs);
	})
    }})
})

// upload gambar
function compressFile(namaFile,url, callback = null) {
		sharp("./tempe/"+namaFile)
		  .resize(200, 300, {
		    fit:  sharp.fit.inside,//'contain',
		  })
		// .jpeg({quality: 10 })
		.withMetadata()
		.toFile(url+namaFile)
		.then(() => {
			fs.readdir('./tempe',(errs, fileses)=>{
				if(errs) throw errs;
				for(const filed of fileses){
					if(filed == namaFile){
						setTimeout(()=>{
							fs.unlinkSync("./tempe/"+filed, (err)=>{
								if(err) throw err;
							console.log('terhapus')
						})

						},1000);
						callback;
					}
				}
			})
  		});
}
// event upload
app.post("/upload/:tabel/:field/:id/:gambar", (req, res)=>{ //
  schema(req.params.tabel);
  let url;
  let namaFile;
  let dats;
  let tgl  		= new Date();
  let field 	= req.params.field;
  let gambar	= req.params.gambar;
  let file 		= req.files.image;
  let id 		= req.params.id;
  let extensi   = path.extname(file.name);

  if(gambar == 'profil'){
  	namaFile = 	field+"-ppdb"+tgl+extensi.replace(/\s+/g, '');
  	url		 = "./app/assets/images/";
  	if(field == 'latar'){
  		dats = {latar:namaFile};
  	}else{
  		dats = {logo:namaFile};
  	}
  }else if(gambar == 'fotoSiswa'){
  	namaFile = "Foto_"+id+extensi.replace(/\s+/g, '');//new Date()+id+file.name.replace(/\s+/g, '');
  	url		 = "./app/assets/foto/";
  	dats 	 = {UpFoto:namaFile};
  }else{
  	namaFile = "Sertifikat_"+id+extensi.replace(/\s+/g, '');//new Date()+id+file.name.replace(/\s+/g, '');
  	url		 = "./app/assets/sertifikat/";
  	dats 	 = {UpSertifikat:namaFile};
  }

  // "./app/assets/temp/"
  file.mv("./tempe/"+namaFile, function(err){
    if(err){
      console.log("ada kesalahan "+err);
    }else{
      console.log("sukses upload" + namaFile);
      	// if(field == "latar"){
	        tabel.findOneAndUpdate({_id:id},{$set:dats},{new:true},(error,docs)=>{
	          if(error){
	            console.log('gagal update foto');
	          }else{
	            // res.json(docs);
	            console.log('berhasil update foto ');
	            if(gambar == 'fotoSiswa'){  //jika foto bukan punyaa admin
	            	compressFile(namaFile,url, setTimeout(()=>{res.json(docs)},1000))
	            }else{
	            	file.mv(url+namaFile,(err)=>{
	            		if(err) throw err;
	            		setTimeout(()=>{res.json(docs)},1000)
	            		fs.readdir('./tempe',(errs, fileses)=>{
							if(errs) throw errs;
							for(const filed of fileses){
								if(filed == namaFile){
									setTimeout(()=>{
										fs.unlinkSync("./tempe/"+filed, (err)=>{
											if(err) throw err;
										console.log('terhapus')
									})

									},1000);
								}
							}
						})
	            	})
	            }
	          }
	        });
    }
  });
})

// route untuk download excel
app.get('/asdAsadD322nsdk2213sDSsdf3sdfsd/:tabel/:ind/:status?',(req,res)=>{
	let baris = 3;
	let dataAdmin;
	let DataStatus;
	if(req.params.status == 'regis'){
		DataStatus = {indexSch:req.params.ind, status:'regis ulang'}
	}else{
		DataStatus = {indexSch:req.params.ind}
	}
	schema(req.params.tabel);

	var wb = new xl.Workbook();
	var ws = wb.addWorksheet('Sheet 1');
	var style1 = wb.createStyle({
		  font: {
		    color: 'blue',
		    size: 12,
		  },
		  alignment: {
		    wrapText: true,
		    horizontal: 'center',
		  },
		  // numberFormat: '$#,##0.00; ($#,##0.00); -',
		});
	var style2 = wb.createStyle({
		  font: {
		    color: 'black',
		    size: 14,
		  },
		  alignment: {
		    wrapText: true,
		    horizontal: 'center',
		  },
		  // numberFormat: '$#,##0.00; ($#,##0.00); -',
		});

	tabel.find(DataStatus,(err,docs)=>{
		if(err) throw err;

		ws.cell(baris,1).string('No');
		ws.cell(baris,2).string('No Peserta');
		ws.cell(baris,3).string('Nama');
		ws.cell(baris,4).string('NISN');
		ws.cell(baris,5).string('L/P');
		ws.cell(baris,6).string('Sekolah');
		ws.cell(baris,7).string('Tempat Lahir');
		ws.cell(baris,8).string('Tgl Lahir');
		ws.cell(baris,9).string('No HP');
		ws.cell(baris,10).string('Alamat');
		ws.cell(baris,11).string('Agama');	
		ws.cell(baris,12).string('Jarak');	
		// ws.cell(baris,13).string('total');	
		// tabel admin cek kuota
		db.tabelAdmin.find({},(errr, sekolah)=>{
					if(errr) throw errr;
					dataAdmin = sekolah[req.params.ind];
		

			// tabel field dinamis
		db.tabelField.find({indexSch:req.params.ind},(errs,dots)=>{
			if(errs) throw errs;

			// kop file
			ws.cell(1,1,1,20+dots.length, true).string('Daftar Peserta PPDB').style(style2);
			ws.cell(2,1,2,20+dots.length, true).string(dataAdmin.sekolah).style(style2);
			// fiel dinamis
			for(let n = 0; dots.length > n; n++){
				ws.cell(baris,13+n).string(dots[n].field_attr);				
			}

			// kolom terakhir
			ws.cell(baris,13+dots.length).string('Point Zona');
			ws.cell(baris,14+dots.length).string('Point Raport');
			ws.cell(baris,15+dots.length).string('Point Prestasi');
			ws.cell(baris,16+dots.length).string('Total Point');
			ws.cell(baris,17+dots.length).string('Double Reg');
			ws.cell(baris,18+dots.length).string('Jalur');
			ws.cell(baris,19+dots.length).string('Status Daftar');
			ws.cell(baris,20+dots.length).string('Status Lulus');
			// isi data perbaris
			for(let i = 0; docs.sort((a,b)=>{return b.konfirm - a.konfirm || a.jarak - b.jarak }).length > i ; i++){
if(typeof(docs[i].nama) != "undefined" ||  typeof(docs[i].nisn) != "undefined" || typeof(docs[i].sex) != "undefined" || typeof(docs[i].sekolah) != "undefined" || typeof(docs[i].tempat) != "undefined" ){
				ws.cell(i+baris+1,1).number(i+1).style(style1);
				ws.cell(i+baris+1,2).number(docs[i].NoPes).style({numberFormat:'000'});
				ws.cell(i+baris+1,3).string(docs[i].nama).style(style1);
				ws.cell(i+baris+1,4).string(docs[i].nisn).style(style1);
				ws.cell(i+baris+1,5).string(docs[i].sex).style(style1);
				ws.cell(i+baris+1,6).string(docs[i].sekolah).style(style1);
				ws.cell(i+baris+1,7).string(docs[i].tempat).style(style1);
				ws.cell(i+baris+1,8).date(docs[i].tgl).style({numberFormat: 'dd-mm-yyyy'});
				ws.cell(i+baris+1,9).string(docs[i].hp).style(style1);
				ws.cell(i+baris+1,10).string(docs[i].alamat).style(style1);
				ws.cell(i+baris+1,11).string(docs[i].agama).style(style1);
				ws.cell(i+baris+1,12).string(docs[i].jarak+" Km").style(style1);
				console.log('index = '+i);
				console.log(docs[i].nama);
				console.log(docs[i].nisn);
				console.log(docs[i].sex);
				console.log(docs[i].sekolah);
				console.log(docs[i].NoPes);
			}
				// dinamis value dari dinamis field
				dots.map((field,index)=>{
					if(docs[i]._doc[field.field_db] != null){
						ws.cell(i+baris+1,13+index).string(docs[i]._doc[field.field_db]).style(style1);
					}
				})

				// cek siswa terdaftar
				if(docs[i].konfirm){
					if(docs[i].zonasi != null || docs[i].raport != null || docs[i].prestasi != null || docs[i].total != null){
						ws.cell(i+baris+1,13+dots.length).number(docs[i].zonasi).style(style1);
						ws.cell(i+baris+1,14+dots.length).number(docs[i].raport).style(style1);
						ws.cell(i+baris+1,15+dots.length).number(docs[i].prestasi).style(style1);
						ws.cell(i+baris+1,16+dots.length).number(docs[i].total).style(style1);
						console.log("nama: "+docs[i].nama+" zon "+docs[i].zonasi+" rap "+docs[i].raport+" pres "+docs[i].prestasi+" tot "+docs[i].total)
					}else{
						ws.cell(i+baris+1,13+dots.length).number(0).style(style1);
						ws.cell(i+baris+1,14+dots.length).number(0).style(style1);
						ws.cell(i+baris+1,15+dots.length).number(0).style(style1);
						ws.cell(i+baris+1,16+dots.length).number(0).style(style1);
					}
						// cek jumlah kuota
					ws.cell(i+baris+1,20+dots.length)
						.string((i < sekolah[req.params.ind].kuota) ? "Lulus" : "Tidak Lulus");
						
				}else{
					ws.cell(i+baris+1,13+dots.length).number(0).style(style1);
					ws.cell(i+baris+1,14+dots.length).number(0).style(style1);
					ws.cell(i+baris+1,15+dots.length).number(0).style(style1);
					ws.cell(i+baris+1,16+dots.length).number(0).style(style1);
					ws.cell(i+baris+1,20+dots.length).string("Tidak Lulus");
				}

				// if(docs[i].UpSertifikat == null || docs[i].UpSertifikat == undefined){
				// 	ws.cell(i+baris+1,18+dots.length).string("Reguler");
				// }else{
				// 	ws.cell(i+baris+1,18+dots.length).string("Prestasi");
				// }

				ws.cell(i+baris+1,18+dots.length)
					.string((docs[i].UpSertifikat == null) ? "Reguler" : "Prestasi");

				ws.cell(i+baris+1,17+dots.length)
					.string((docs[i].otherSch == undefined) ? "" : sekolah[docs[i].otherSch].sekolah );

				ws.cell(i+baris+1,19+dots.length)
					.string((docs[i].konfirm) ? "Complete" : "tidak daftar");

				// cek jumlah kuota
				// ws.cell(i+baris+1,18+dots.length)
				// 	.string((i < sekolah[0].kuota) ? "Lulus" : "Tidak Lulus");
				// 	console.log(sekolah[0].kuota)
			}
		
			wb.write('Excel_'+Math.floor(Math.random()*10000)+'.xlsx', res);
			}) // tutup tabel admin
		}) // tutup tabel dinamis
	}) //tutup tabel pertama
})

module.exports = app;
