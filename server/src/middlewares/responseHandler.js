export const responseFormatter = (req, res, next) => {
  // Method for successful responses
  res.success = (data, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  };

  // Method for error responses
  res.error = (code, message, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  };

  next();
};

// Global Error Handler Middleware
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Erreur non gérée :", err);
  
  // If headers are already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Use our custom error formatter for unhandled errors
  return res.status(500).json({
    success: false,
    error: {
      code: "SERVER_ERROR",
      message: "Une erreur inattendue est survenue",
    },
  });
};
