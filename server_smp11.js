
let express 	= require('express');
let server 		= express();
let bodyParser 	= require('body-parser');
let cors		= require('cors');
let fs 			= require('fs');
let path		= require('path');
let app 		= require('http').createServer(server);
//let apps 		= require('https').createServer({
//			cert:fs.readFileSync('sertif/mongodb.crt'),
//			key:fs.readFileSync('sertif/mongodb.key'),
//			passphrase: 'exelfer'},server);
let ios 		= require('socket.io').listen(app);
//let io 			= require('socket.io').listen(app);
let router  	= require('./router.js');
let portHttp 	= 34543;
let portHttps	= 38701;
let upload		= require('express-fileupload');

server.use(cors());
server.use(upload());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use('/', router);
server.use(express.static(__dirname+'/app/assets'));
// server.use(express.static(__dirname+'/app'));
// server.get('*', (req, res)=>{
// 	res.sendFile(__dirname+"/app/index.html");
// })

//apps.listen(portHttps,()=>{console.log('server https  di port '+portHttps)});
app.listen(portHttp,()=>{console.log('server http di port '+portHttp)});

//io.on('connection',(socket)=>{
//	console.log('user connected');
//	socket.on('nambah siswa',(data)=>{
//		io.emit('nambah array',data);
//	})

//	socket.on('rubah profil',(data)=>{
//		io.emit('profil berubah',data);
//	})

//	socket.on('chat kirim',(chat)=>{
//		io.emit('chat terima', chat);
//	})

//	socket.on('new chater',(data)=>{
//		io.emit('login guest', data);
//	})

//	socket.on('guest logout',(data)=>{
//		io.emit('cekout', data);	
//	})

//	socket.on('nambah',(data)=>{
//		io.emit('tambah', data);	
//	})
//	socket.on('edit nilai',(data)=>{
//		io.emit('refresh', data);
//	})
	// log out
//	socket.on('disconnect',()=>{
//		console.log('user out');
//	})
//})

// jika https
ios.on('connection',(socket)=>{
	console.log('user connected');
	socket.on('nambah siswa',(data)=>{
		ios.emit('nambah array',data);
	})

	socket.on('rubah profil',(data)=>{
		ios.emit('profil berubah',data);
	})

	socket.on('chat kirim',(chat)=>{
		ios.emit('chat terima', chat);
	})

	socket.on('new chater',(data)=>{
		ios.emit('login guest', data);
	})

	socket.on('guest logout',(data)=>{
		ios.emit('cekout', data);	
	})

	socket.on('nambah',(data)=>{
		ios.emit('tambah', data);	
	})
	socket.on('edit nilai',(data)=>{
		ios.emit('refresh', data);
	})
	// log out
	socket.on('disconnect',()=>{
		console.log('user out');
	})
})
