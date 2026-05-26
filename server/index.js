require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

// Portfolio routes
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes');
const financialRoutes = require('./routes/financialRoutes');

// Career routes
const careerRoutes = require('./career/routes/adminRoutes');
const careerPublicRoutes = require('./career/routes/publicRoutes');
const careerAuthRoutes = require('./career/routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Core Middlewares
let allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

if (process.env.ALLOWED_ORIGINS) {
  // Parse comma-separated list, stripping brackets, quotes, newlines, and whitespace
  const origins = process.env.ALLOWED_ORIGINS
    .replace(/[\[\]\n\r']/g, '') // remove brackets, newlines, and single quotes
    .split(',')
    .map(o => o.trim())
    .filter(o => o);
  allowedOrigins = [...allowedOrigins, ...origins];
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter rate limit for application submissions
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many applications submitted. Please try again later.' },
});
app.use('/api/career/apply', applyLimiter);



// ==========================================
// Portfolio API Routes (UNCHANGED)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api', newsRoutes);
app.use('/api', contactInfoRoutes);
app.use('/api', financialRoutes);

// ==========================================
// Career API Routes (NEW)
// ==========================================// Career routes
app.use('/api/career/admin', careerRoutes);
app.use('/api/career', careerPublicRoutes);
app.use('/api/career/auth', careerAuthRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 5MB limit' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
