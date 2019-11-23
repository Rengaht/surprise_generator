
var _current_page;
var _next_page;
var _status_record;
var _repeat_record;

var _rec_sec;
var _ready_sec;


// user //
var _guid="";
var _video_watched="";
var _record_share_url;

// qrcode //
var _watch_qrcode;
var _record_qrcode;


// loading //
var _watch_loading_buffer;

function loadBackImage(){
	var src_=[];
	for(var i=0;i<60;++i) src_.push('asset/seq/BG_1/bg-01_'+leftPad(i,5)+'.png');

	$('#_back_loop_big').spritespin({
		source:src_,			
		animate: true,
		retainAnimate:true,
		sizeMode:'fill',
		responsive:false,
		frames:60
	});			

	var src2_=[];
	for(var i=1;i<=60;++i) src2_.push('asset/seq/BG_2/bg-02_'+leftPad(i,5)+'.png');

	$('#_back_loop_small').spritespin({
		source:src2_,			
		animate: true,
		retainAnimate:true,
		sizeMode:'fill',
		responsive:false,
		frames:60
	});			

	var _img_loading=[];
	for(var i=0;i<200;++i) _img_loading.push('asset/seq/Downloading/downloading_'+leftPad(i,5)+'.png');

	$('#_back_loading').spritespin({
		source:_img_loading,			
		animate: true,
		retainAnimate:false,
		sizeMode:'fill',
		responsive:false,
		frameTime:33,
		onFrame:loadingFrameUpdate,
		onLoad:function(){
			$('#_back_loading').spritespin("api").loop(false);
		}
	});	


	
	
}
function backOnLoad(){

}

function leftPad(value, length){ 
    return ('0'.repeat(length) + value).slice(-length); 
}

window.onload=function(){

	loadBackImage();
	_current_page='_page_home';
	setHideHomeButton(true);

	_watch_qrcode=new QRCode("_watch_qrcode",{
		text: "",
		width: 80,
		height: 80,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.M
	});
	_record_qrcode=new QRCode("_record_qrcode",{
		text: "",
		width: 180,
		height: 180,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.M
	});

	preview=document.getElementById("_video_preview");
	recording=document.getElementById("_video_recording");

	document.getElementById("_video_watching").onended=onWatchVideoFinish;


	//goPage('_page_record_video');

}

function homeClicked(){
	goPage('_page_home');
}

function setHideHomeButton(set_){
	if(set_){
		$('#_home_button').addClass('hidden');
	}else{
		$('#_home_button').removeClass('hidden');
	}
}


function goPage(page_){

	$('#'+_current_page).addClass('hidden');
	if(page_==='_page_home'){
		setHideHomeButton(true);
		fadeOutBgm();
	}else{
		setHideHomeButton(false);
		if(page_==='_page_record_video' || page_==='_page_watch_video'){
			turnOffBgm();
		}else fadeInBgm();
	}
	if(page_==='_page_watch_video' || page_==='_page_record_autho' || page_==='_page_record_video'){
		$('#_back_image_loading').addClass('hidden');
		$('#_back_image_big').addClass('hidden');
		$('#_back_image_small').removeClass('hidden');
	}else if(page_==='_page_watch_loading'){
		$('#_back_image_loading').removeClass('hidden');
		$('#_back_image_big').addClass('hidden');
		$('#_back_image_small').addClass('hidden');
	}else{
		$('#_back_image_loading').addClass('hidden');		
		$('#_back_image_small').addClass('hidden');
		$('#_back_image_big').removeClass('hidden');
	}



	switch(page_){
		case '_page_watch_loading':
			playSound('click');				
			break;		
		case '_page_record_video':
			playSound('click');
			_repeat_record=2;
			_status_record='ready';

			requestCamera();
			startCountDown();
			break;		
		case '_page_watch_video':
			playSound('click');
			break;
		case '_page_watch_code':
		case '_page_send':
		case '_page_lottery':
				playSound('click');
				openKeyboarad();
				$('#_input_watch_code').text('');
				$('#_input_send_name').text('');
				$('#_input_send_phone').text('');
				$('#_input_lottery_name').text('');
				$('#_input_lottery_number').text('');
				$('#_input_lottery_price').text('');
				$('#_input_lottery_email').text('');
				$('#_input_lottery_phone').text('');
				break;
		case '_page_send_success':
		case '_page_lottery_success':
				playSound('finish');
				break;
		case '_page_record_autho':
		case '_page_home':
				playSound('click');
				break;
	}

	$('#'+page_).removeClass('hidden');
	_current_page=page_;
}

function recordAgain(){
	_repeat_record--;
	if(_repeat_record<0) return;

	startCountDown();
}
function startCountDown(){
	$('#_video_recording').removeClass('hidden');
	$('#_video_preview').addClass('hidden');

	$('#_acc_recording').addClass('hidden');
	$('#_acc_preview').addClass('hidden');
	$('#_acc_ready').removeClass('hidden');

	// start coundown
	_ready_sec=3;
	playSound('count');
	$('#_record_ready_countdown').text(_ready_sec);
	let _ready_count=setInterval(function(){
		_ready_sec--;
		$('#_record_ready_countdown').text(_ready_sec);
		playSound('count');

		if(_ready_sec==0){
			startRecord();
			clearInterval(_ready_count);
		}
	},1000);
}

function startRecord(){
	
	_status_record='recording';
	$('#_acc_ready').addClass('hidden');
	$('#_acc_recording').removeClass('hidden');
		
	startVideoRecording();

	// start coundown
	_rec_sec=recordingTimeMS/1000;
	$('#_record_countdown').text(_rec_sec);
	let _ready_count=setInterval(function(){
		_rec_sec--;
		$('#_record_countdown').text(_rec_sec);
		
		if(_rec_sec==0){
			//stopVideoRecording();
		
			$('#_video_recording').addClass('hidden');
			$('#_video_preview').removeClass('hidden');

			_status_record='preview';
			$('#_acc_recording').addClass('hidden');
			$('#_acc_preview').removeClass('hidden');

			playSound('finish');
		}
	},1000);

	
}

function sendSurprise(){
	
	var fd=new FormData();
	fd.append('action','upload');
	fd.append('file',recordedBlob);
	fd.append('send_name',$('#_input_send_name').val());
	fd.append('send_number',$('#_input_send_phone').val());

	_record_qrcode.clear();

	$.ajax({
		url:'https://mmlab.com.tw/project/surprisegenerator/backend/action.php',
		type:'POST',
		data:fd,
		processData: false,
		contentType: false,
		cache:false,
		error:function(xhr){
			console.log('something went wrong...');
		},
		success:function(response){
			console.log(response);
			_guid=response.guid;
			
			$('#_record_code').text(_guid);
			_record_qrcode.makeCode(response.share_url);

			goPage('_page_send_success');
		}
	});
}

function sendTicketInfo(){

	var fd=new FormData();
	fd.append('action','ticketInfo');
	fd.append('guid',_guid);
	fd.append('name',$('#_input_lottery_name').val());
	fd.append('ticket_number',$('#_input_lottery_number').val());
	fd.append('ticket_price',$('#_input_lottery_price').val());
	fd.append('email',$('#_input_lottery_email').val());
	fd.append('phone',$('#_input_lottery_phone').val());
	fd.append('watched_video',_video_watched);

	$.ajax({
		url:'https://mmlab.com.tw/project/surprisegenerator/backend/action.php',
		type:'POST',
		data:fd,
		processData: false,
		contentType: false,
		cache:false,
		error:function(xhr){
			console.log('something went wrong...');
		},
		success:function(response){
			console.log(response);
			goPage('_page_lottery_success');
		}
	});

}

function loadVideo(){

	var fd=new FormData();
	fd.append('action','loadVideo');
	fd.append('guid',$('#_input_watch_code').val());

	$('#_watch_finish_button').addClass('hidden');
	$('#_loading_text').addClass('hidden');
	
	_watch_qrcode.clear();

	$.ajax({
		url:'https://mmlab.com.tw/project/surprisegenerator/backend/action.php',
		type:'POST',
		data:fd,
		processData: false,
		contentType: false,
		cache:false,
		error:function(xhr){
			console.log('something went wrong...');
			
		},
		success:function(response){
			console.log(response);
			if(response.result==='success'){
				setloadingVideo(response.video_url);
				_watch_qrcode.makeCode(response.share_url);
			}
		}
	});

}
function setloadingVideo(url_){


	$('#_video_watching').attr('src',url_);
	$('#_video_watching')[0].load();
	$('#_video_watching')[0].muted=true;

	goPage('_page_watch_loading');
	let x=$('#_back_loading').spritespin("api");
	x.updateFrame(0);
	x.startAnimation();
	
}
function loadingFrameUpdate(e,data){
    if(data.frame==60 && _current_page==='_page_watch_loading'){
		

		$('#_loading_text').removeClass('hidden');	
		_watch_loading_buffer=setInterval(function(){
		    
			var percent=$('#_back_loading').spritespin("api").currentFrame()/199.0*100.0;
		    $('#_loading_percent').text(Math.min(Math.round(percent),100));
		    
		},33);
	}else if(data.frame==199 && _current_page==='_page_watch_loading'){
        clearInterval(_watch_loading_buffer);
    	
		goPage('_page_watch_video');
		
		setTimeout(function(){
			$('#_video_watching')[0].pause();
			$('#_video_watching')[0].currentFrame='0';
			$('#_video_watching')[0].play();
			$('#_video_watching')[0].muted=false;
		},1000);

		$('#_video_watching')[0].loop=false;		
	}
	
}
function onWatchVideoFinish(){
	$('#_watch_finish_button').removeClass('hidden');
}


function openKeyboarad(){
	// $.ajax({
 //        url : 'js/cmd/keyboard_cmd.php'
 //    }).done(function(data) {
 //        console.log(data);
 //    });
}


// sound //
function fadeInBgm(){
	document.getElementById('_sound_bgm').play();
	$('#_sound_bgm').animate({volume:1},1000);
}
function fadeOutBgm(){
	$('#_sound_bgm').animate({volume:0.2},1000);
}
function turnOffBgm(){
	$('#_sound_bgm').animate({volume:0},2500);	
}

function playSound(type_){
	switch(type_){
		case 'count':
			document.getElementById('_sound_count').play();
			break;
		case 'click':
			document.getElementById('_sound_click').play();
			break;
		case 'finish':
			document.getElementById('_sound_finish').play();
			break;
	}
}