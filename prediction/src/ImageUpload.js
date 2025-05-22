import React, { useState } from 'react';
import backgroundImage from './assets/background.png'; // Replace with your actual image file

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setResponse('Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
  
      const result = await res.json();
      const label = result.class || 'Unknown';
      const confidence = result.confidence
        ? (parseFloat(result.confidence) * 100).toFixed(2)
        : 'N/A';
  
      setResponse(`${label} - Confidence: ${confidence}%`);
    } catch (err) {
      console.error('Error:', err);
      setResponse('Upload failed');
    }
  };
  

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        textShadow: '1px 1px 2px black',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        <h2>Upload Potato Leaf Image</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          {previewUrl && (
            <div style={{ marginTop: '20px' }}>
              <p>Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '300px', borderRadius: '8px' }}
              />
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button type="submit">Submit</button>
          </div>
        </form>

        <div
          id="response"
          style={{
            marginTop: '20px',
            whiteSpace: 'pre-wrap',
            color: '#caffbf',
            fontSize: '14px',
          }}
        >
          {response}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;



