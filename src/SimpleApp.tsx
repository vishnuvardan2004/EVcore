import React from 'react';

function SimpleApp() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🚗 EVCORE Platform - Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Vehicle Management Test</h2>
        <p>✅ Server is running</p>
        <p>✅ React is loading</p>
        <p>✅ Ready to test vehicles</p>
        
        <button 
          onClick={() => alert('Button works!')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default SimpleApp;
