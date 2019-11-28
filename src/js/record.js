var preview;
var recording;
var recorder;

let recordingTimeMS = 30000;
var recordedBlob;

function wait(delayInMS) {
  return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function startStreamRecording(stream, lengthInMS){

  console.log('Start Recroding...');

  recorder = new MediaRecorder(stream);
  let data = [];

  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();
  console.log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });

  let recorded = wait(lengthInMS).then(
    () => recorder.state == "recording" && recorder.stop()
  );

  return Promise.all([
    stopped,
    recorded
  ])
  .then(() => data);
}

function stop(stream){
  if(stream!=null)
    stream.getTracks().forEach(track => track.stop());
}

function requestCamera(){

  hideItem($('#_video_recording'));
  hideItem($('#_video_preview'));

  hideItem($('#_acc_recording'));
  hideItem($('#_acc_preview'));
  hideItem($('#_preview_control'));
  hideItem($('#_acc_ready'));

  hideItem($('#_record_ready_countdown'));
  hideItem($('#_record_ready_text'));


  const hdConstraints = {
    video: {width: {min: 1280}, height: {min: 960},aspectRatio:{ideal:1.33333}},
    audio: true
  };
 
  console.log('Request Camera...');

  navigator.mediaDevices.getUserMedia(hdConstraints)
  .then(stream => {
    recording.srcObject = stream;
    //downloadButton.href = stream;
    recording.captureStream = recording.captureStream || recording.mozCaptureStream;
    

    turnOffBgm();   
    setTimeout(function(){
       showItem($('#_video_recording'));
        setTimeout(function(){     
          showItem($('#_acc_ready'));
          
          setTimeout(function(){
            startCountDown();
          },VIDEO_DELAY);      

        },HINT_DELAY);
       
    },VIDEO_FRAME_DELAY);
    
    

    return new Promise(resolve => recording.onplaying = resolve);

  }).catch(error=>{
    console.log(error);
  });
}

function startVideoRecording(){
  
  startStreamRecording(recording.captureStream(), recordingTimeMS)
  .then (recordedChunks => {

    delete recordedBlob;
    
    recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
    preview.src = URL.createObjectURL(recordedBlob);
    
    //downloadButton.href = recording.src;
    //downloadButton.download = "RecordedVideo.webm";
    sendJandiLog("start recording");
    console.log("Successfully recorded " + recordedBlob.size + " bytes of " +
        recordedBlob.type + " media.");
    stopVideoRecording();
  })
  .catch(error=>{
    console.log(error);
  });
}

function stopVideoRecording(){
  //recorder.stop();
  stop(recording.srcObject);
  
  resetSleepTimer();
  //sendJandiLog("stop recording");
}
function resetRecorder(){
  if(recorder!==undefined && recorder.state==recording) recorder.stop();

  clearTimeout(_show_preview_timeout);
  clearInterval(_record_countdown_interval);
  clearInterval(_ready_countdown_interval);

  
  $('#_video_preview')[0].pause();
  $('#_video_preview')[0].src="";
}
