import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [speechCondition, setSpeechCondition] = useState('');
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register', {
        name,
        age: age ? parseInt(age) : null,
        speech_condition: speechCondition || null,
        consent: consent ? 1 : 0,
      });
      localStorage.setItem('user_id', response.data.user_id); // Store user_id directly
      navigate('/record'); // Redirect to Recorder
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 rounded-2xl shadow-2xl p-8 mt-20 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-8 text-center">
        Join SpeakMate
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:outline-none transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Age (optional)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:outline-none transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Speech Condition (optional)</label>
          <input
            type="text"
            value={speechCondition}
            onChange={(e) => setSpeechCondition(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:outline-none transition-all duration-300"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="w-5 h-5 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-400"
          />
          <label className="ml-2 text-gray-300">I consent to recording my voice</label>
        </div>
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 shadow-xl"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;