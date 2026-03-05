let recorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("status");
const audioEl = document.getElementById("audio");

startBtn.onclick = async () => {
  console.log("START CLICK");

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  recorder = new MediaRecorder(stream, {
    mimeType: "audio/webm"
  });

  audioChunks = [];

  recorder.ondataavailable = (e) => {
    console.log("DATA:", e.data.size);
    if (e.data.size > 0) {
      audioChunks.push(e.data);
    }
  };

  recorder.onstop = () => {
    console.log("STOP");

    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);

    audioEl.src = url;
    statusText.textContent = "Ieraksts pabeigts";

    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

  recorder.start(); // ⬅️ ŠIS IR KRITISKS
  statusText.textContent = "🎙 Ieraksta...";
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  if (recorder && recorder.state === "recording") {
    recorder.stop(); // ⬅️ bez šī NEKAS netiek saglabāts
    statusText.textContent = "⏳ Apstrādā audio...";
  }
};
