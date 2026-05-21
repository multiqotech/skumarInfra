/**
 * Validate job creation/update payload.
 * Returns { isValid, errors } object.
 */
const validateJob = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (data.title && data.title.length > 200) {
    errors.push('Title cannot exceed 200 characters');
  }

  if (!data.department || typeof data.department !== 'string' || data.department.trim().length === 0) {
    errors.push('Department is required');
  }

  if (!data.location || typeof data.location !== 'string' || data.location.trim().length === 0) {
    errors.push('Location is required');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  const validEmploymentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  if (data.employmentType && !validEmploymentTypes.includes(data.employmentType)) {
    errors.push(`Employment type must be one of: ${validEmploymentTypes.join(', ')}`);
  }

  const validJobTypes = ['On-site', 'Remote', 'Hybrid'];
  if (data.jobType && !validJobTypes.includes(data.jobType)) {
    errors.push(`Job type must be one of: ${validJobTypes.join(', ')}`);
  }

  const validStatuses = ['Draft', 'Published', 'Archived'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (data.openings !== undefined && (isNaN(data.openings) || data.openings < 0)) {
    errors.push('Openings must be a non-negative number');
  }

  if (data.salary) {
    if (data.salary.min !== undefined && isNaN(data.salary.min)) errors.push('Salary min must be a number');
    if (data.salary.max !== undefined && isNaN(data.salary.max)) errors.push('Salary max must be a number');
  }

  if (data.experience) {
    if (data.experience.min !== undefined && isNaN(data.experience.min)) errors.push('Experience min must be a number');
    if (data.experience.max !== undefined && isNaN(data.experience.max)) errors.push('Experience max must be a number');
  }

  return { isValid: errors.length === 0, errors };
};

module.exports = { validateJob };
