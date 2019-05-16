let express 	= require('express');
let server 		= express();
let bodyParser 	= require('body-parser');
let cors		= require('cors');
let app 		= require('http').createServer(server);
let io 			= require('socket.io').listen(app);
let router  	= require('./router.js')
let port		= 8000;
let upload		= require('express-fileupload');

server.use(cors());
server.use(upload());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use('/', router);
server.use(express.static(__dirname+'/app/assets'));
server.use(express.static(__dirname+'/app'));
server.get('*', (req, res)=>{
	res.sendFile(__dirname+"/app/index.html");
})

app.listen(port,()=>{console.log('server di port '+port)});

io.on('connection',(socket)=>{
	console.log('user connected');
	socket.on('nambah siswa',(data)=>{
		io.emit('nambah array',data);
	})

	socket.on('rubah profil',(data)=>{
		io.emit('profil berubah',data);
	})

	socket.on('chat kirim',(chat)=>{
		io.emit('chat terima', chat);
	})

	socket.on('new chater',(data)=>{
		io.emit('login guest', data);
	})

	socket.on('guest logout',(data)=>{
		io.emit('cekout', data);	
	})

	socket.on('nambah',(data)=>{
		io.emit('tambah', data);	
	})
	socket.on('edit nilai',(data)=>{
		io.emit('refresh', data);
	})
	// log out
	socket.on('disconnect',()=>{
		console.log('user out');
	})
})