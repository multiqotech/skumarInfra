const jwt = require('jsonwebtoken');
const CareerUser = require('../models/CareerUser');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const { uploadToCloudinary } = require('../../config/cloudinary');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new career user
 * @route   POST /api/career/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await CareerUser.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await CareerUser.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      
      res.cookie('career_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/career/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await CareerUser.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.cookie('career_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/career/auth/logout
 */
const logout = (req, res) => {
  res.cookie('career_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get user profile
 * @route   GET /api/career/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await CareerUser.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
};

/**
 * @desc    Get candidate profile for logged-in user
 * @route   GET /api/career/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });
    if (!candidate) {
      return res.json(null);
    }
    
    // Fetch all applications for this candidate to find applied job IDs
    const applications = await Application.find({ candidateId: candidate._id }).select('jobId');
    const appliedJobIds = applications.map(app => app.jobId.toString());
    
    res.json({
      ...candidate.toObject(),
      appliedJobIds,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create or update candidate profile for logged-in user
 * @route   PUT /api/career/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      location,
      linkedin,
      portfolio,
      experience,
      expectedSalary,
      noticePeriod,
    } = req.body;

    let resumeUrl = '';
    let resumePublicId = '';

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        resumeUrl = result.secure_url;
        resumePublicId = result.public_id;
      } catch (err) {
        return res.status(400).json({ message: 'Failed to upload resume' });
      }
    }

    let candidate = await Candidate.findOne({ user: req.user._id });

    if (candidate) {
      candidate.fullName = fullName || candidate.fullName;
      candidate.phone = phone || candidate.phone;
      candidate.location = location !== undefined ? location : candidate.location;
      candidate.linkedin = linkedin !== undefined ? linkedin : candidate.linkedin;
      candidate.portfolio = portfolio !== undefined ? portfolio : candidate.portfolio;
      candidate.experience = experience !== undefined && experience !== '' ? Number(experience) : candidate.experience;
      candidate.expectedSalary = expectedSalary !== undefined ? expectedSalary : candidate.expectedSalary;
      candidate.noticePeriod = noticePeriod !== undefined ? noticePeriod : candidate.noticePeriod;
      
      if (resumeUrl) {
        candidate.resumeUrl = resumeUrl;
        candidate.resumePublicId = resumePublicId;
      }

      await candidate.save();
    } else {
      // Create new candidate profile linked to user
      candidate = await Candidate.create({
        user: req.user._id,
        fullName: fullName || req.user.name,
        email: req.user.email.toLowerCase(),
        phone: phone || '',
        location: location || '',
        linkedin: linkedin || '',
        portfolio: portfolio || '',
        resumeUrl,
        resumePublicId,
        experience: experience && experience !== '' ? Number(experience) : 0,
        expectedSalary: expectedSalary || '',
        noticePeriod: noticePeriod || '',
      });
    }

    // Set profileCompleted to true
    if (!req.user.profileCompleted) {
      req.user.profileCompleted = true;
      await req.user.save();
    }

    res.json({
      message: 'Profile updated successfully',
      candidate,
      profileCompleted: req.user.profileCompleted,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  getProfile,
  updateProfile,
};
