import React, { useState } from 'react';

const CampaignForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    keywords: '',
    subreddits: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert comma-separated strings to arrays and trim whitespace
    const keywords = formData.keywords.split(',').map(k => k.trim());
    const subreddits = formData.subreddits.split(',').map(s => s.trim());
    
    onSubmit({ keywords, subreddits });
  };

  return (
    <div className="campaign-form">
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="keywords">Keywords:</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="AI, Machine Learning, Data Science"
            required
          />
          <small>Separate multiple keywords with commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="subreddits">Subreddits:</label>
          <input
            type="text"
            id="subreddits"
            name="subreddits"
            value={formData.subreddits}
            onChange={handleChange}
            placeholder="realtors, realestate, technology"
            required
          />
          <small>Separate multiple subreddits with commas</small>
        </div>

        <button type="submit">Start Campaign</button>
      </form>
    </div>
  );
};

export default CampaignForm;