import React, { useState } from 'react';
import AWS from 'aws-sdk';

const S3Uploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage('Select a file.');
      return;
    }

    setUploading(true);
    setMessage('');

    // AWS yapılandırması
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: 'one-way-flow',
      Key: file.name,
      Body: file
    };

    try {
      await s3.upload(params).promise();
      setMessage('File has been uploaded successfuly!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>One Way Flow - File Uploader</h1>
      <input type="file" onChange={handleFileChange} style={{ marginBottom: '20px', width: '100%' }} />
      <button 
        onClick={uploadFile} 
        disabled={uploading || !file} 
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: uploading || !file ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: uploading || !file ? 'not-allowed' : 'pointer' 
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && (
        <p style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default S3Uploader;