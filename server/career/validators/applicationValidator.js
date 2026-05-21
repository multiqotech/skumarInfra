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
  }

  if (!data.jobSlug || typeof data.jobSlug !== 'string') {
    errors.push('Job reference is required');
  }

  if (data.experience !== undefined && data.experience !== '' && isNaN(Number(data.experience))) {
    errors.push('Experience must be a number');
  }

  if (data.coverLetter && data.coverLetter.length > 5000) {
    errors.push('Cover letter cannot exceed 5000 characters');
  }

  if (data.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\//.test(data.linkedin)) {
    errors.push('Please provide a valid LinkedIn URL');
  }

  return { isValid: errors.length === 0, errors };
};

module.exports = { validateApplication };
