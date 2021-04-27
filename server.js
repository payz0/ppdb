
let express 	= require('express');
let server 		= express();
let bodyParser 	= require('body-parser');
let cors		= require('cors');
let fs 			= require('fs');
let path		= require('path');
let app 		= require('http').createServer(server)
let ios 		= require('socket.io').listen(app);
let router  	= require('./router.js');
let portHttp 	= 38702;
let portHttps	= 38701;
let portLocal	= 8001;
let upload		= require('express-fileupload');

server.use(cors());
server.use(upload());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use('/', router);
server.use(express.static(__dirname+'/app/assets'));
app.listen(portLocal,()=>{console.log('server http di port '+portLocal)});

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
