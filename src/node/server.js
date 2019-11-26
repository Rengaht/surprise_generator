const express=require('express');
const SocketServer=require('ws').Server;
const path=require('path');

const PORT=3000;
const EXPLODE_COUNT=20;
const SERIAL_COM='COM144';

// websocket server //
const server=express().listen(PORT,()=>console.log('websocket listen on '+PORT));
const wws=new SocketServer({server});

wws.on('connection',ws=>{
	
	ws.on('close',()=>{
		console.log('Close connected!');
	});
	ws.on('message',data=>{
		console.log('get message: '+data);
		sendLight(data);
	});
});

// serial port //
const Serialport=require('serialport');
const port=new Serialport(SERIAL_COM,{baudRate:9600,autoOpen:false});

console.log('open serial port!');
port.open(function(err){
	if(err) return console.log('Error opening port: ',err.message);
	port.write('hello');
});
port.on('open',function(){
	console.log('serial port open!');
	sendLight('sleep');
});
port.on('error', function(err) {
  console.log('Error: ', err.message)
});
port.on('data', function (data) {
  console.log('Data:', data)
})

// html server //
const app=express();
app.use(express.static('../../'));
app.get('/',function(req,res){	
	res.sendFile('C://xampp/htdocs/surprise_generator/index.html');
});

var HttpServer=app.listen(5000);

function sendLight(light_){
	switch(light_){
		case 'sleep':
		 	port.write('s',onSerialError);
		 	break;
		case 'recording':
			port.write('r',onSerialError);
			break;		
	}
}
function onSerialError(err){
	if(err){
    	return console.log('Error on write: ', err.message);
  	}
  	console.log('message written');
}

process.on('exit', function(){
	port.close();
});

