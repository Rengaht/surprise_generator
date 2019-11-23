var preview;
var recording;
var recorder;

let recordingTimeMS = 30000;
var recordedBlob;

function wait(delayInMS) {
  return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function startStreamRecording(stream, lengthInMS){
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
  stream.getTracks().forEach(track => track.stop());
}

function requestCamera(){
  const hdConstraints = {
    video: {width: {min: 1280}, height: {min: 960},aspectRatio:{ideal:1.33333}},
    audio: true
  };
 
  navigator.mediaDevices.getUserMedia(hdConstraints)
  .then(stream => {
    recording.srcObject = stream;
    //downloadButton.href = stream;
    recording.captureStream = recording.captureStream || recording.mozCaptureStream;
    
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
    
    console.log("Successfully recorded " + recordedBlob.size + " bytes of " +
        recordedBlob.type + " media.");
  })
  .catch(error=>{
    console.log(error);
  });
}

function stopVideoRecording(){
  //recorder.stop();
  //stop(recording.srcObject);

}
