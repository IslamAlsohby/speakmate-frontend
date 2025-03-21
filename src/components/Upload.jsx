import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [sentenceId, setSentenceId] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/sentences').then(res => setSentences(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('user_id', localStorage.getItem('user_id'));
    formData.append('sentence_id', sentenceId);
    await axios.post('http://127.0.0.1:5000/api/upload', formData);
    setFile(null);
    setMessage('File uploaded!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="max-w-md mx-auto card animate-fade-in">
      <h1 className="text-3xl font-bold text-accent-purple mb-6 text-center">Upload Recording</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])}
               className="w-full text-light-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-accent-purple file:text-white hover:file:bg-light-accent" />
        <select value={sentenceId} onChange={e => setSentenceId(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-accent-purple">
          {sentences.map((s, i) => <option key={i} value={i}>{s}</option>)}
        </select>
        <button type="submit" className="btn bg-accent-purple text-white hover:bg-light-accent w-full">Upload</button>
      </form>
      {message && <p className="mt-4 text-center text-green-400">{message}</p>}
    </div>
  );
}

export default Upload;