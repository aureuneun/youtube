const recorderContainer = document.getElementById("jsRecorderContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObj;
let videoRecorder;

const handleVideoData = (e) => {
  const { data: videoFile } = e;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.innerHTML = "Start recording";
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", handleRecordClick);
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObj);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  recordBtn.addEventListener("click", stopRecording);
};

const handleRecordClick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = "Stop recording";
    streamObj = stream;
    startRecording();
  } catch (e) {
    console.log(e);
    recordBtn.innerHTML = "Can't record";
  } finally {
    recordBtn.removeEventListener("click", handleRecordClick);
  }
};

const recordInit = () => {
  recordBtn.addEventListener("click", handleRecordClick);
};

if (recorderContainer) {
  recordInit();
}
