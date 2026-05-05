// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};