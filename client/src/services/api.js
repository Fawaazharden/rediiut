const API_BASE_URL = 'http://localhost:5000/api';

export const startCampaign = async (campaignData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to start campaign');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please make sure the server is running.');
    }
    throw error;
  }
};