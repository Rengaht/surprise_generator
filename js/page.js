
var _current_page;
var _next_page;
var _status_record;

function loadBackImage(){
	var src_=[];
	for(var i=0;i<60;++i) src_.push('seq/BG_1/bg-01_'+leftPad(i,5)+'.png');

	$('#_back_loop_big').spritespin({
		source:src_,			
		animate: true,
		retainAnimate:true,
		sizeMode:'fill',
		responsive:false,
		onLoad:backOnLoad,
		onFrameChanged:frameUpdate,
		frames:60
	});			

	var src2_=[];
	for(var i=1;i<=60;++i) src2_.push('seq/BG_2/bg-02_'+leftPad(i,5)+'.png');

	$('#_back_loop_small').spritespin({
		source:src2_,			
		animate: true,
		retainAnimate:true,
		sizeMode:'fill',
		responsive:false,
		onLoad:backOnLoad,
		onFrameChanged:frameUpdate,
		frames:60
	});			
}
function backOnLoad(){

}
function frameUpdate(){

}

function leftPad(value, length){ 
    return ('0'.repeat(length) + value).slice(-length); 
}

window.onload=function(){

	loadBackImage();
	_current_page='_page_home';
	setHideHomeButton(true);
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
	}else{
		setHideHomeButton(false);
	}
	if(page_==='_page_watch_video' || page_==='_page_record_autho' || page_==='_page_record_video'){
		$('#_back_image_big').addClass('hidden');
		$('#_back_image_small').removeClass('hidden');
	}else{
		$('#_back_image_big').removeClass('hidden');
		$('#_back_image_small').addClass('hidden');
	}



	switch(page_){
		case '_page_watch_loading':
			setTimeout(function(){
				goPage('_page_watch_video');
			},1000);
			break;		
		case '_page_record_video':
			_status_record='ready';
			$('#_acc_recording').addClass('hidden');
			$('#_acc_preview').addClass('hidden');

			setTimeout(function(){
				_status_record='recording';
				$('#_acc_ready').addClass('hidden');
				$('#_acc_recording').removeClass('hidden');

				setTimeout(function(){
					_status_record='preview';
					$('#_acc_recording').addClass('hidden');
					$('#_acc_preview').removeClass('hidden');
				},5000);

			},3000);
			break;		
	}

	$('#'+page_).removeClass('hidden');
	_current_page=page_;
}

function recordAgain(){

}

function sendSurprise(){
	goPage('_page_send_success');
}