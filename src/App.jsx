import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Recorder from './components/Recorder';
import Dataset from './components/Dataset';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <nav className="bg-gray-900 shadow-lg p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              SpeakMate Datasets Project
            </Link>
            <div className="space-x-6">
              <Link to="/record" className="text-gray-300 hover:text-cyan-400 transition-colors">Record</Link>
              <Link to="/dataset" className="text-gray-300 hover:text-cyan-400 transition-colors">Dataset</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/record" element={<Recorder />} />
          <Route path="/dataset" element={<Dataset />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;