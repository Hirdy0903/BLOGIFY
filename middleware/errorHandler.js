function globalErrorHandler(err, req, res, next) {
  // Log the error trace locally in your console for debugging
  console.error(`[Error Logged]: ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;

  // Render a user-friendly generic fallback page on your UI
  return res.status(statusCode).render('homepage', {
    user: req.user || null, // Keeps the navbar state active
    blogs: [], // Empty state fallback to keep the homepage loop from crashing
    error: "Something went wrong on our end. Please try again later."
  });
}

module.exports = { globalErrorHandler };