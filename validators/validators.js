const { z } = require('zod');

const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .trim()
    .lowercase()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

const validateSignup = (req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    const errors = {};
    
    if (result.error && result.error.issues) {
      result.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
    }

    return res.status(400).render('signup', {
      errors,
      prevInput: req.body
    });
  }

  req.body = result.data;
  next();
};

module.exports = { validateSignup };