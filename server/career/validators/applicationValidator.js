const Job = require('../models/Job');

/**
 * Validate application submission payload.
 * Returns { isValid, errors } object.
 */
const validateApplication = (data) => {
  const errors = [];

  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length === 0) {
    errors.push('Full name is required');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    errors.push('Phone number is required');
  } else {
    const cleaned = data.phone.replace(/[\s\-()]/g, '');
    if (!/^\+?\d{10,15}$/.test(cleaned)) {
      errors.push('Please provide a valid phone number (10-15 digits)');
    }
  }

  if (!data.jobSlug || typeof data.jobSlug !== 'string') {
    errors.push('Job reference is required');
  }

  if (data.experience === undefined || data.experience === '') {
    errors.push('Experience is required');
  } else if (isNaN(Number(data.experience))) {
    errors.push('Experience must be a number');
  } else if (Number(data.experience) < 0) {
    errors.push('Experience cannot be negative');
  }

  if (data.coverLetter && data.coverLetter.length > 5000) {
    errors.push('Cover letter cannot exceed 5000 characters');
  }

  if (data.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\//.test(data.linkedin)) {
    errors.push('Please provide a valid LinkedIn URL');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate experience against job requirements.
 * Must be called async since it needs to fetch the job.
 */
const validateExperienceForJob = async (data) => {
  const errors = [];

  if (!data.jobSlug) return { isValid: true, errors };

  try {
    const job = await Job.findOne({ slug: data.jobSlug });
    if (!job) return { isValid: true, errors }; // Job validation handled elsewhere

    const exp = Number(data.experience);
    if (isNaN(exp)) return { isValid: true, errors }; // Basic validation handled above

    const minExp = job.experience?.min;
    const maxExp = job.experience?.max;

    if (minExp !== undefined && minExp > 0 && exp < minExp) {
      errors.push(`This role requires minimum ${minExp} year${minExp !== 1 ? 's' : ''} of experience. You have ${exp} year${exp !== 1 ? 's' : ''}.`);
    }
  } catch (err) {
    console.error('Error validating experience against job:', err);
  }

  return { isValid: errors.length === 0, errors };
};

module.exports = { validateApplication, validateExperienceForJob };
