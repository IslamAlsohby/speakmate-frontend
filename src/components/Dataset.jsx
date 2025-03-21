import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dataset() {
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    axios.get(`https://speakmate-backend.onrender.com/api/dataset/${userId}`)
      .then(res => setRecordings(res.data))
      .catch(err => console.error('Error fetching dataset:', err));
  }, []);

  const deleteRecording = (id) => {
    axios.delete(`https://speakmate-backend.onrender.com/api/delete/${id}`)
      .then(() => {
        setRecordings(recordings.filter(r => r.id !== id));
        setMessage('Recording deleted.');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(err => console.error('Error deleting recording:', err));
  };

  const exportDataset = async () => {
    const userId = localStorage.getItem('user_id');
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await axios.get(`https://speakmate-backend.onrender.com/api/export/${userId}`, {
          responseType: 'blob',
          timeout: 30000,
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `dataset_${userId}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setMessage('Dataset exported successfully!');
        setTimeout(() => setMessage(''), 2000);
        break;
      } catch (err) {
        attempt++;
        if (attempt === maxRetries) {
          setMessage('Failed to export dataset after retries.');
          console.error('Export failed:', err);
          setTimeout(() => setMessage(''), 2000);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 rounded-2xl shadow-2xl p-10 animate-fade-in">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-10 text-center">
        Your Dataset
      </h1>
      <button
        onClick={exportDataset}
        className="mb-8 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 shadow-xl"
      >
        Export Dataset
      </button>
      <div className="grid grid-cols-1 gap-6">
        {recordings.map(rec => (
          <div key={rec.id} className="bg-gray-800 rounded-xl p-6 flex justify-between items-center shadow-lg animate-slide-up">
            <div>
              <p className="text-xl text-white font-semibold">{rec.sentence_text}</p>
              <p className="text-sm text-gray-400">Sentence ID: {rec.sentence_id} | Duration: {rec.duration}s | {rec.timestamp}</p>
              <audio controls src={`https://speakmate-backend.onrender.com/uploads/${rec.filename}`} className="mt-2 w-full max-w-md rounded-lg shadow-md" />
            </div>
            <button
              onClick={() => deleteRecording(rec.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {message && (
        <p className="mt-6 text-center text-xl text-green-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}

export default Dataset;