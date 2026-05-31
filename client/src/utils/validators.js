export const validateRegister = ({ name, email, password }) => {
  const errors = {};

  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email address';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';

  return errors;
};

export const validateTask = ({ title }) => {
  const errors = {};

  if (!title || title.trim().length === 0) errors.title = 'Title is required';
  if (title && title.length > 100) errors.title = 'Title must be under 100 characters';

  return errors;
};
