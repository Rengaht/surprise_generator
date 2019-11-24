const VIDEO_DELAY=3000;
const HINT_DELAY=3000;


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
	document.getElementById("_video_preview").onended=onPreviewVideoFinish;

	// check input empty
	$('#_input_watch_code').bind("change paste keyup",function(){
		$('#_error_watch_code').addClass('hidden');
		if($(this).val().length<6) $('#_button_watch_code').addClass('Disabled');
		else $('#_button_watch_code').removeClass('Disabled');		
	});
	$('#_input_send_name').bind("change paste keyup",function(){
		toggleSendSurpriseError(false);
	});
	$('#_input_send_phone').bind("change paste keyup",function(){
		 $(this).val($(this).val().replace(/[^\d]+/g,''));
		 $(this).val($(this).val().replace(/(\d{4})\-?(\d{3})\-?(\d{3})/,'$1-$2-$3'))
		toggleSendSurpriseError(false);
	});
	$('#_input_lottery_name').bind("change paste keyup",function(){
		toggleLotteryError(false);
	});
	$('#_input_lottery_number').bind("change paste keyup",function(){
		 $(this).val($(this).val().replace(/([a-zA-Z]{2})\-?(\d{8})/,'$1-$2'))
		toggleLotteryError(false);
	});
	$('#_input_lottery_price').bind("change paste keyup",function(){
		$(this).val($(this).val().replace(/[^\d]+/g,''));
		toggleLotteryError(false);	
	});
	$('#_input_lottery_email').bind("change paste keyup",function(){		
		toggleLotteryError(false);	
	});
	$('#_input_lottery_phone').bind("change paste keyup",function(){
		$(this).val($(this).val().replace(/[^\d]+/g,''));
		$(this).val($(this).val().replace(/(\d{4})\-?(\d{3})\-?(\d{3})/,'$1-$2-$3'))
		toggleLotteryError(false);	
	});

	// video progress
	$('#_video_watching').bind('timeupdate',updateWatchProgress);
	$('#_progress_video_watch').on("click",changeWatchProgress);

	$('#_video_preview').bind('timeupdate',updatePreviewProgress);
	$('#_progress_video_preview').on("click",changePreviewProgress);
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
		case '_page_home':
			playSound('click');	
			_video_watched="";
			break;
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
				playSound('click');
				openKeyboarad();
				$('#_input_watch_code').val('');
				$('#_error_watch_code').addClass('hidden');
				break;
		case '_page_send':
				playSound('click');
				openKeyboarad();				
				$('#_input_send_name').val('');
				$('#_input_send_phone').val('');
				break;
		case '_page_lottery':
				playSound('click');
				openKeyboarad();							
				$('#_input_lottery_name').val('');
				$('#_input_lottery_number').val('');
				$('#_input_lottery_price').val('');
				$('#_input_lottery_email').val('');
				$('#_input_lottery_phone').val('');
				break;
		case '_page_send_success':
				$("#_success_send").hide();
  				setTimeout(function(){
    				$("#_success_send").show();
    				playSound('finish');
  				}, 800);
				break;
		case '_page_lottery_success':
				$("#_success_lottery").hide();
  				setTimeout(function(){
    				$("#_success_lottery").show();
    				playSound('finish');
  				},800);
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

	playSound('click');
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
	restartCountDownCircle();
	// start coundown
	_rec_sec=recordingTimeMS/1000;
	$('#_record_countdown_number').text(_rec_sec+'s');
	_record_countdown_interval=setInterval(updateRecordCountdown,1000);

	
}
function restartCountDownCircle(){	
	restartAnimation($('#_loading_circle'));	
}
function restartAnimation(element_){
	var clone_=element_.clone(true);
	element_.before(clone_);
	$(".LoadingCircle").last().remove();
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
		hideItem($('#_video_preview'));

		_status_record='preview';
		hideItem($('#_record_finish_button'));
		hideItem($('#_acc_recording'));

		if(_repeat_record==0){
			hideItem($('#_button_record_again'));
		}else showItem($('#_button_record_again'));


		setTimeout(showPreviewVideo,1000);
		
	}
}
function showPreviewVideo(){
	showItem($('#_video_preview'));
	showItem($('#_acc_preview'));
	showItem($('#_preview_control'));

	playSound('finish');

	setTimeout(function(){
		$('#_video_preview')[0].play();		
	},VIDEO_DELAY);

}
function onPreviewVideoFinish(){
	playSound('finish');
	showItem($('#_record_finish_button'));	
}

function checkSendSurpriseInput(){

	var invalid_name=$('#_input_send_name').val().length<1;

	var phoneRegx=/^09\d{2}-\d{3}-\d{3}$/;
	var input_phone=$('#_input_send_phone').val();
	var invalid_phone=input_phone.length<12 || (!phoneRegx.test(input_phone));

	var error_text="";
	if(invalid_name) error_text=error_text+"*姓名不可空白\n";
	if(invalid_phone) error_text=error_text+"*手機號碼錯誤";

	toggleSendSurpriseError(error_text.length>0,error_text);
	return error_text.length==0;

}
function toggleSendSurpriseError(show_,error_text){
	if(show_){
		$('#_error_send_surprise').text(error_text);
		showItem($('#_error_send_surprise'));
		$('#_button_send_surprise').addClass('Disabled');
	}else{
		hideItem($('#_error_send_surprise'));
		$('#_button_send_surprise').removeClass('Disabled');
	}
}

function sendSurprise(){

	if(!checkSendSurpriseInput()){
		playSound('error');
		return;	
	} 
	playSound('click');
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
function checkSendLotteryInput(){

	var error_text="";
	if($('#_input_lottery_name').val().length<1) error_text=error_text+"*姓名不可空白\n";

	var numRegx=/^[a-zA-Z]{2}-\d{8}$/
	var input_num=$('#_input_lottery_number').val();
	if(input_num.length<11 || !numRegx.test(input_num)) error_text=error_text+"*發票號碼錯誤\n";

	if($('#_input_lottery_price').val().length<1) error_text=error_text+"*發票金額不可空白\n";

	var emailRegx=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var input_email=$('#_input_lottery_email').val().toLowerCase();
    if(!emailRegx.test(input_email)) error_text=error_text+"*email錯誤\n";

	var phoneRegx=/^09\d{2}-\d{3}-\d{3}$/;
	var input_phone=$('#_input_lottery_phone').val();
	if(input_phone.length<12 || (!phoneRegx.test(input_phone))) error_text=error_text+"*手機號碼錯誤";

	toggleLotteryError(error_text.length>0,error_text);

	return error_text.length==0;
}
function toggleLotteryError(show_,text_){
	if(show_){
		$('#_error_send_lottery').text(text_);
		$('#_error_send_lottery').removeClass('hidden');
		$('#_button_send_lottery').addClass('Disabled');
	}else{
		$('#_error_send_lottery').addClass('hidden');
		$('#_button_send_lottery').removeClass('Disabled');
	}
}

function sendTicketInfo(){

	if(!checkSendLotteryInput()){
		playSound('error');
		return;
	} 
	playSound('click');
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

	if($('#_input_watch_code').val().length<6){
		showItem($('#_error_watch_code'));
		playSound('error');
		return;
	}

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
				
				_video_watched=_video_watched+$('#_input_watch_code').val()+"|";

				setloadingVideo(response.video_url);
				_watch_qrcode.makeCode(response.share_url);
			}else{
				playSound('error');
				showItem($('#_error_watch_code'));
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
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function updateWatchProgress(){
	var cur_time=$('#_video_watching')[0].currentTime;
	var total_time=recordingTimeMS/1000;//$('#_video_watching')[0].duration;
	var len=cur_time/total_time*810.0;

	$('#_progress_video_watch').css('width',len);
	$('#_time_video_watch').text('00:'+pad(Math.round(cur_time),2));

}
function changeWatchProgress(e){
	var offset=$(this).offset();
    var left=(e.pageX-offset.left);
    var percentage=(left/810.0);
    var vidTime=recordingTimeMS/1000*percentage;
	
	$('#_video_watching')[0].currentTime=vidTime;
	$('#_video_watching')[0].play();
}

function onWatchVideoFinish(){
	showItem($('#_watch_finish_button'));
	playSound('finish');
}


function updatePreviewProgress(){
	var cur_time=$('#_video_preview')[0].currentTime;
	var total_time=recordingTimeMS/1000;//$('#_video_watching')[0].duration;
	var len=cur_time/total_time*810.0;

	$('#_progress_video_preview').css('width',len);
	$('#_time_video_preview').text('00:'+pad(Math.round(cur_time),2));

}
function changePreviewProgress(e){
	var offset=$(this).offset();
    var left=(e.pageX-offset.left);
    var percentage=(left/810.0);
    var vidTime=recordingTimeMS/1000*percentage;
	
	$('#_video_preview')[0].currentTime=vidTime;
	$('#_video_preview')[0].play();
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
		case 'error':
			document.getElementById('_sound_error').play();
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