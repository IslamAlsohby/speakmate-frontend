import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, recordings: 0, size: 0 });

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/dataset').then(res => {
      const recordings = res.data.length;
      setStats({ users: new Set(res.data.map(d => d.user_id)).size, recordings, size: recordings * 5 });
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-accent-purple mb-8 text-center animate-fade-in">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <p className="text-lg text-light-accent">Users Registered</p>
          <p className="text-3xl font-bold text-white">{stats.users}</p>
        </div>
        <div className="card text-center">
          <p className="text-lg text-light-accent">Total Recordings</p>
          <p className="text-3xl font-bold text-white">{stats.recordings}</p>
        </div>
        <div className="card text-center">
          <p className="text-lg text-light-accent">Dataset Size (MB)</p>
          <p className="text-3xl font-bold text-white">{stats.size}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/register" className="btn bg-accent-purple text-white hover:bg-light-accent text-center">Register New User</Link>
        <Link to="/record" className="btn bg-accent-purple text-white hover:bg-light-accent text-center">Start Recording</Link>
        <Link to="/upload" className="btn bg-accent-purple text-white hover:bg-light-accent text-center">Upload File</Link>
        <Link to="/dataset" className="btn bg-accent-purple text-white hover:bg-light-accent text-center">Manage Dataset</Link>
        <Link to="/export" className="btn bg-accent-purple text-white hover:bg-light-accent text-center">Export Dataset</Link>
      </div>
    </div>
  );
}

export default Dashboard;