import React, { useState } from 'react';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import { startCampaign } from './services/api';
import './App.css';

function App() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCampaignSubmit = async (formData) => {
    try {
      setError(null);
      setSuccess(false);
      const response = await startCampaign(formData);
      console.log('Campaign started:', response);
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting campaign:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Reddit Marketing Tool</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Campaign started successfully!</div>}
      <CampaignForm onSubmit={handleCampaignSubmit} />
      <CampaignList />
    </div>
  );
}

export default App;