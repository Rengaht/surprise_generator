const express=require('express');
const SocketServer=require('ws').Server;
const path=require('path');

const PORT=3000;
const EXPLODE_COUNT=20;
const SERIAL_COM='COM144';

// websocket server //
const server=express().listen(PORT,()=>console.log('websocket listen on '+PORT));
const wws=new SocketServer({server});


const exec = require('child_process').exec;
var iconv = require('iconv-lite');



wws.on('connection',ws=>{
	
	ws.on('close',()=>{
		console.log('Close connected!');
	});
	ws.on('message',data=>{
		console.log('get message: '+data);
		if(data.includes('sms')){

			var str_=data.split("|");
			sendSMS(str_[1],str_[2],str_[3]);

		}else sendLight(data);
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
// port.on('data', function (data) {
//   console.log('Data:', data)
// })

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

function sendSMS(phone_,name_,guid_){
	console.log("send sms: "+phone_+' | '+name_+' | '+guid_);

	var message_=name_+'你好，你的朋友於誠品生活【驚喜生成器】製作了一個驚喜送給你，領取序號是'+guid_+'。快去看看是什麼驚喜!';
	sendMessage(phone_,message_);

	setTimeout(function(){
		var message2_='//誠品生活 驚喜物所 期間限定// 時間：2019.12.01-2020.01.02 據點：信義店 1F｜松菸店 1F｜西門店 B1';
		sendMessage(phone_,message2_);
	},2000);

}
function sendMessage(phone_,message_){
	var cmd='notify2.exe 202.39.54.130 89869165 f6397ec2 '+phone_+' '+message_;
	console.log(cmd);

	exec(cmd,
	    (error, stdout, stderr) => {
	        console.log(stdout);
	        if(stderr) console.log(`error: ${stderr}`);
	        if (error !== null) {
	            console.log(`exec error: ${error}`);
	        }
	});


}