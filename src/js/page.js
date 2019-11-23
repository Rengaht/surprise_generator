var VIDEO_DELAY=3000;
var HINT_DELAY=3000;


var _current_page;
var _next_page;
var _status_record;
var _repeat_record;

var _rec_sec,_record_countdown_interval;
var _ready_sec,_ready_countdown_interval;


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

	//check video recording
	stopVideoRecording();
	// TODO: check video playing
	$('#_video_preview')[0].pause();
	$('#_video_watching')[0].pause();

	goPage('_page_home');
}

function setHideHomeButton(set_){
	if(set_){
		hideItem($('#_home_button'));
	}else{
		showItem($('#_home_button'));
	}
}


function goPage(page_){
	
	hideItem($('#'+_current_page));
	if(page_==='_page_home'){
		setHideHomeButton(true);
		fadeOutBgm();
	}else{
		setHideHomeButton(false);
		if(page_!=='_page_record_video' || page_==='_page_watch_video'){
			fadeInBgm();
		}
	}
	if(page_==='_page_watch_video' || page_==='_page_record_autho' || page_==='_page_record_video'){
		hideItem($('#_back_image_loading'));
		hideItem($('#_back_image_big'));
		showItem($('#_back_image_small'));

	}else if(page_==='_page_watch_loading'){
		showItem($('#_back_image_loading'));
		hideItem($('#_back_image_big'));
		hideItem($('#_back_image_small'));
		
	}else{
		hideItem($('#_back_image_loading'));
		showItem($('#_back_image_big'));
		hideItem($('#_back_image_small'));		
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
			
			break;		
		case '_page_watch_video':
			playSound('click');
			break;
		case '_page_watch_code':
		case '_page_send':
		case '_page_lottery':
				playSound('click');
				openKeyboarad();
				$('#_input_watch_code').val('');
				$('#_input_send_name').val('');
				$('#_input_send_phone').val('');
				$('#_input_lottery_name').val('');
				$('#_input_lottery_number').val('');
				$('#_input_lottery_price').val('');
				$('#_input_lottery_email').val('');
				$('#_input_lottery_phone').val('');
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

	showItem($('#'+page_));
	_current_page=page_;
}

function recordAgain(){
	_repeat_record--;
	if(_repeat_record<0) return;

	requestCamera();
}
function startCountDown(){
	
	showItem($('#_record_ready_countdown'));
	showItem($('#_record_ready_text'));

	// start coundown
	_ready_sec=3;
	playSound('count');
	$('#_record_ready_countdown').text(_ready_sec);
	_ready_countdown_interval=setInterval(updateReadyCountdown,1000);
}
function updateReadyCountdown(){
	_ready_sec--;
	$('#_record_ready_countdown').text(_ready_sec);
	playSound('count');

	if(_ready_sec==0){
		startRecord();
		clearInterval(_ready_countdown_interval);
	}
}

function startRecord(){
	
	_status_record='recording';
	hideItem($('#_acc_ready'));
	showItem($('#_acc_recording'));
		
	startVideoRecording();
	startCountDownCircle();
	// start coundown
	_rec_sec=recordingTimeMS/1000;
	$('#_record_countdown_number').text(_rec_sec+'s');
	_record_countdown_interval=setInterval(updateRecordCountdown,1000);

	
}
function startCountDownCircle(){
	var wrap=$('#_circle_countdown_wrapper');
	wrap.removeClass('Anim');
	wrap.addClass('Anim');

	var left=$('#_circle_countdown_left');
	left.removeClass('LeftAnim');
	left.addClass('LeftAnim');

	var right=$('#_circle_countdown_right');
	right.removeClass('RightAnim');
	right.addClass('RightAnim');
}


function updateRecordCountdown(){
	_rec_sec--;
	$('#_record_countdown_number').text(_rec_sec+'s');
	
	if(_rec_sec==0){
		//stopVideoRecording();
		clearInterval(_record_countdown_interval);

		$('#_video_preview')[0].pause();		
		$('#_video_preview')[0].currentFrame='0';

		hideItem($('#_video_recording'));
		showItem($('#_video_preview'));

		_status_record='preview';
		hideItem($('#_record_finish_button'));
		hideItem($('#_acc_recording'));
		showItem($('#_acc_preview'));
		playSound('finish');

		setTimeout(showPreviewVideo,VIDEO_DELAY);
		
	}
}
function showPreviewVideo(){
	$('#_video_preview')[0].play();		

	setTimeout(function(){
		showItem($('#_record_finish_button'));
	},VIDEO_DELAY);

}



function sendSurprise(){
	
	var fd=new FormData();
	fd.append('action','upload');
	fd.append('file',recordedBlob);
	fd.append('send_name',$('#_input_send_name').val());
	fd.append('send_number',$('#_input_send_phone').val());

	sendSMS($('#_input_send_name').val(),$('#_input_send_phone').val());
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

	hideItem($('#_watch_finish_button'));
	hideItem($('#_loading_text'));

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
		
    	showItem($('#_loading_text'));
		_watch_loading_buffer=setInterval(function(){
		    
			var percent=$('#_back_loading').spritespin("api").currentFrame()/199.0*100.0;
		    $('#_loading_percent').text(Math.min(Math.round(percent),100));
		    
		},33);
	}else if(data.frame==199 && _current_page==='_page_watch_loading'){
        clearInterval(_watch_loading_buffer);
    	
		goPage('_page_watch_video');
		$('#_video_watching')[0].pause();
		$('#_video_watching')[0].currentFrame='0';

		turnOffBgm();
		setTimeout(function(){		
			$('#_video_watching')[0].play();
			$('#_video_watching')[0].muted=false;
		},VIDEO_DELAY);

		$('#_video_watching')[0].loop=false;		
	}
	
}
function onWatchVideoFinish(){
	showItem($('#_watch_finish_button'));
	playSound('finish');
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
	$('#_sound_bgm').animate({volume:0},VIDEO_DELAY);	
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

function hideItem(item_){
	//if(item_.hasClass('hidden')) return;
	item_.addClass('hidden');
	setTimeout(function(){
		item_.addClass('close');
	},500);
}
function showItem(item_){
	//if(!item_.hasClass('hidden')) return;
	item_.removeClass('close');
	setTimeout(function(){		
		item_.removeClass('hidden');		
	},100);
}

// TODO:
function sendSMS(name_,phone_){


}