const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  keywords: [String],
  subreddits: [String],
  status: String,
  results: Object,
  createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

// Routes
app.post('/api/campaigns', async (req, res) => {
  try {
    const { keywords, subreddits } = req.body;
    const campaign = new Campaign({ 
      keywords, 
      subreddits, 
      status: 'running' 
    });
    await campaign.save();

    // Send immediate response after saving campaign
    res.status(201).json({ 
      message: 'Campaign created successfully',
      campaign: campaign
    });

    // Handle Python process after sending response
    const pythonProcess = spawn('python', [
      'py_script/src/main.py',
      JSON.stringify(keywords),
      JSON.stringify(subreddits),
      process.env.REDDIT_CLIENT_ID,
      process.env.REDDIT_CLIENT_SECRET,
      process.env.REDDIT_USER_AGENT,
      process.env.REDDIT_USERNAME,
      process.env.REDDIT_PASSWORD
    ]);

    let pythonOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      try {
        if (code === 0 && pythonOutput) {
          campaign.results = JSON.parse(pythonOutput);
          campaign.status = 'completed';
          await campaign.save();
        } else {
          campaign.status = 'failed';
          campaign.results = { error: 'Python process failed' };
          await campaign.save();
        }
      } catch (error) {
        console.error('Error processing Python output:', error);
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/campaigns', async (req, res) => {
  const campaigns = await Campaign.find().sort('-createdAt');
  res.json(campaigns);
});

// Add error handler for MongoDB connection
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Add port listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));