import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WaveSurfer from 'wavesurfer.js';

function Recorder() {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState('');
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    axios.get('https://speakmate-backend.onrender.com/api/sentences')
      .then(res => setSentences(res.data))
      .catch(err => console.error('Error fetching sentences:', err));
    axios.get(`https://speakmate-backend.onrender.com/api/user_progress/${userId}`)
      .then(res => setCurrentSentenceIndex(res.data.next_sentence_index || 0))
      .catch(err => console.error('Error fetching progress:', err));

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#00d4ff',
      progressColor: '#007bff',
      cursorColor: '#ffffff',
      barWidth: 4,
      barRadius: 4,
      barGap: 2,
      height: 140,
      responsive: true,
      backend: 'MediaElement',
    });

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const newAudioUrl = URL.createObjectURL(blob);
        setAudioUrl(newAudioUrl);
        wavesurferRef.current.load(newAudioUrl);
        if (audioRef.current) {
          audioRef.current.src = newAudioUrl;
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      setMessage('Microphone access denied.');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const saveRecording = async () => {
    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('user_id', userId);
    formData.append('sentence_id', currentSentenceIndex);
    try {
      await axios.post('https://speakmate-backend.onrender.com/api/record', formData);
      await axios.post(`https://speakmate-backend.onrender.com/api/update_progress/${userId}`, {
        next_sentence_index: currentSentenceIndex + 1,
      });
      setMessage('Recording saved! Moving to next sentence.');
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioBlob(null);
      setAudioUrl(null);
      wavesurferRef.current.empty();
      if (audioRef.current) {
        audioRef.current.src = '';
      }
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
      }
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Error saving recording.');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    wavesurferRef.current.empty();
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    setMessage('Recording discarded.');
    setTimeout(() => setMessage(''), 2000);
  };

  const jumpToSentence = (index) => {
    if (index >= 0 && index < sentences.length) {
      setCurrentSentenceIndex(index);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 rounded-2xl shadow-2xl p-10 animate-fade-in">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-10 text-center">
        Record Your Speech
      </h1>
      {sentences.length > 0 && (
        <div className="flex justify-center mb-8">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-cyan-400 transition-all duration-500 ease-in-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={`${((currentSentenceIndex + 1) / sentences.length) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-cyan-400">{Math.round((currentSentenceIndex + 1) / sentences.length * 100)}%</p>
              <p className="text-sm text-gray-400">{currentSentenceIndex + 1}/{sentences.length}</p>
            </div>
          </div>
        </div>
      )}
      {sentences.length > 0 && currentSentenceIndex < sentences.length && (
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => jumpToSentence(currentSentenceIndex - 1)}
            disabled={currentSentenceIndex === 0}
            className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-800 transition-all duration-300"
          >
            Previous
          </button>
          <input
            type="number"
            min="1"
            max={sentences.length}
            value={currentSentenceIndex + 1}
            onChange={(e) => jumpToSentence(parseInt(e.target.value) - 1)}
            className="w-20 p-2 text-center bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
          />
          <button
            onClick={() => jumpToSentence(currentSentenceIndex + 1)}
            disabled={currentSentenceIndex >= sentences.length - 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-800 transition-all duration-300"
          >
            Next
          </button>
        </div>
      )}
      {sentences.length > 0 && currentSentenceIndex < sentences.length ? (
        <div className="bg-gray-800 rounded-xl p-8 mb-8 shadow-lg animate-slide-up">
          <p className="text-2xl text-white font-semibold text-center">{sentences[currentSentenceIndex]}</p>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Sentence {currentSentenceIndex + 1} of {sentences.length}
          </p>
        </div>
      ) : (
        <p className="text-2xl text-cyan-400 text-center mb-8">All sentences recorded! 🎉</p>
      )}
      <div className="flex justify-center space-x-8 mb-8">
        <button
          onClick={startRecording}
          disabled={recording || currentSentenceIndex >= sentences.length}
          className={`px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 shadow-xl ${
            recording || currentSentenceIndex >= sentences.length
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 animate-pulse-subtle'
          }`}
        >
          {recording ? 'Recording...' : 'Start'}
        </button>
        <button
          onClick={stopRecording}
          disabled={!recording}
          className={`px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 shadow-xl ${
            !recording ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Stop
        </button>
      </div>
      <div className="bg-gray-700 rounded-xl p-6 shadow-inner">
        <div ref={waveformRef} className="rounded-lg overflow-hidden"></div>
        <div className="flex justify-center space-x-6 mt-6 animate-fade-in">
          <audio ref={audioRef} controls className="w-full max-w-md rounded-lg shadow-md" />
          {audioBlob && (
            <>
              <button
                onClick={saveRecording}
                className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 shadow-lg"
              >
                Save
              </button>
              <button
                onClick={deleteRecording}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-lg"
              >
                Discard
              </button>
            </>
          )}
        </div>
      </div>
      {message && (
        <p className="mt-6 text-center text-xl text-green-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}

export default Recorder;