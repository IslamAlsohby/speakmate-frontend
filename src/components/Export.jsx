import React from 'react';

function Export() {
  return (
    <div className="max-w-md mx-auto card animate-fade-in text-center">
      <h1 className="text-3xl font-bold text-accent-purple mb-6">Export Dataset</h1>
      <a href="http://127.0.0.1:5000/api/export" download className="btn bg-accent-purple text-white hover:bg-light-accent">
        Download Dataset as ZIP
      </a>
    </div>
  );
}

export default Export;