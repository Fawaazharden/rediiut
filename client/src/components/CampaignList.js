import React, { useEffect, useState } from 'react';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchCampaigns, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="campaigns-list">
      <h2>Active Campaigns</h2>
      {campaigns.map((campaign) => (
        <div key={campaign._id} className="campaign-card">
          <h3>Campaign Status: {campaign.status}</h3>
          <p>Keywords: {campaign.keywords.join(', ')}</p>
          <p>Subreddits: {campaign.subreddits.join(', ')}</p>
          {campaign.results && (
            <div className="results">
              <h4>Results:</h4>
              <pre>{JSON.stringify(campaign.results, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CampaignList;