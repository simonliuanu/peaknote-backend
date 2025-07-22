const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://white-forest-056934c1e.6.azurestaticapps.net'
    : 'http://localhost:8000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Meeting notes routes
app.post('/api/meetings/generate', (req, res) => {
  const { meetingUrl, template } = req.body;
  
  // Demo response - replace with actual implementation
  const meetingNotes = {
    id: Date.now(),
    meetingUrl,
    template,
    notes: generateMockNotes(template),
    createdAt: new Date().toISOString()
  };
  
  res.json(meetingNotes);
});

app.get('/api/meetings/:id', (req, res) => {
  const { id } = req.params;
  
  // Demo response
  res.json({
    id,
    notes: 'Meeting notes would be retrieved here',
    createdAt: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

function generateMockNotes(template) {
  const templates = {
    standard: {
      agenda: ['Review previous action items', 'Discuss current objectives', 'Plan next steps'],
      participants: ['Team Lead', 'Developer 1', 'Developer 2'],
      actionItems: ['Complete feature implementation', 'Schedule follow-up meeting'],
      decisions: ['Approved new design approach']
    },
    client: {
      agenda: ['Client requirements review', 'Project timeline discussion', 'Budget considerations'],
      participants: ['Client Representative', 'Project Manager', 'Technical Lead'],
      actionItems: ['Prepare technical specification', 'Schedule design review'],
      decisions: ['Confirmed project scope']
    },
    scrum: {
      agenda: ['Sprint review', 'Retrospective', 'Sprint planning'],
      participants: ['Scrum Master', 'Product Owner', 'Development Team'],
      actionItems: ['Update user stories', 'Refine backlog'],
      decisions: ['Sprint goals defined']
    },
    standup: {
      agenda: ['Yesterday\'s progress', 'Today\'s plans', 'Blockers'],
      participants: ['Team Member 1', 'Team Member 2', 'Team Member 3'],
      actionItems: ['Resolve technical blockers', 'Code review'],
      decisions: ['Priority tasks identified']
    }
  };
  
  return templates[template] || templates.standard;
}

app.listen(PORT, () => {
  console.log(`PeakNote backend server running on port ${PORT}`);
});