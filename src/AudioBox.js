import { useEffect, useState } from "react";
import { ReactMic } from "react-mic";
import "./AudioBox.css";
import { BsFillPauseFill } from "react-icons/bs";
import { FaRegPlayCircle } from "react-icons/fa";

const AudioBox = () => {
  const [record, setRecord] = useState(false);
  const [recording, isRecording] = useState("stop");
  const [audio, setAduio] = useState(null);
  const [time, setTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [interv, setInterv] = useState();
  const [progress, setProgress] = useState(0);
  const [background, setBackground] = useState("");

  let updatedTime = time;
  let updatedPlayTime = playTime;
  const runTime = () => {
    if (updatedTime <= 30) {
      updatedTime++;
    }
    return setTime(updatedTime);
  };
  const playingTime = () => {
    if (updatedPlayTime < time) {
      updatedPlayTime++;
    }
    return setPlayTime(updatedPlayTime);
  };
  const startRecording = () => {
    isRecording("play");
    setRecord(true);
    runTime();
    setInterv(setInterval(runTime, 1000));
  };
  const onStop = (recordedBlob) => {
    console.log(recordedBlob);
    setAduio(new Audio(recordedBlob.blobURL));
    setBackground("#b721ff");
    isRecording("pause");
  };
  const stopRecording = () => {
    setRecord(false);
    clearInterval(interv);
  };
  const startPlaying = () => {
    isRecording("playing");
    playingTime();
    setInterv(setInterval(playingTime, 1000));
    audio.play();
  };
  const sendAudio = () => {
    if (audio) {
      console.log(audio.src);
    } else {
      alert("please record");
    }
  };
  useEffect(() => {
    if (time === 30) {
      stopRecording();
    }
  }, [time, playTime]);
  useEffect(() => {
    setProgress((playTime / time) * 100);
  }, [time, playTime]);
  return (
    <div className="audioBox">
      <div className="audioBox__top">
        <div className="audioBox__topLeft">
          {recording === "stop" && <h4 onClick={startRecording}>Start</h4>}
          {recording === "play" && <h4>Recording...</h4>}
          {recording === "pause" && <h4>Recording pause</h4>}
          {recording === "paused" && <h4>Recording pause</h4>}
          {recording === "playing" && <h4>Recording playing</h4>}
          {recording === "stop" && (
            <h3>
              00:00 <span>/ 00:30</span>
            </h3>
          )}
          {recording === "play" && (
            <h3>
              00:{time < 10 ? "0" + time : time} <span>/ 00:30</span>
            </h3>
          )}
          {recording === "pause" && (
            <h3>
              00:00 <span>/ 00:{time < 10 ? "0" + time : time}</span>
            </h3>
          )}
          {recording === "playing" && (
            <h3>
              00:{playTime < 10 ? "0" + playTime : playTime}
              <span>/ 00:{time < 10 ? "0" + time : time}</span>
            </h3>
          )}
          {recording === "paused" && (
            <h3>
              00:{playTime < 10 ? "0" + playTime : playTime}
              <span>/ 00:{time < 10 ? "0" + time : time}</span>
            </h3>
          )}
        </div>
        <div className="audioBox__topRight">
          {record && (
            <div onClick={stopRecording} className="audioBox__topRight-icon">
              <BsFillPauseFill
                style={{ fontSize: "1.9rem", color: "#061732" }}
              />
            </div>
          )}
          <button
            style={{ background }}
            onClick={sendAudio}
            className="audioBox__topRight-button"
          >
            Send
          </button>
        </div>
      </div>
      <div className="audioBox__bottom">
        {recording === "pause" ||
        recording === "playing" ||
        recording === "paused" ? (
          <>
            {recording === "playing" ? (
              <BsFillPauseFill
                className="audioBox__bottomIcon"
                onClick={() => {
                  audio.pause();
                  isRecording("paused");
                  clearInterval(interv);
                }}
              />
            ) : (
              <FaRegPlayCircle
                onClick={audio && startPlaying}
                className="audioBox__bottomIcon"
              />
            )}

            <div className="audioBox__progress">
              <div
                className="audioBox__progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <ReactMic
            record={record}
            className="audioBox__bottom-wave"
            onStop={onStop}
            strokeColor="#b721ff"
            backgroundColor="#061732"
          />
        )}
      </div>
    </div>
  );
};

export default AudioBox;
