const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  //Mongoose bad objectId
  if (err.name === "CastError") {
    message = "Resource not found";
    statusCode = 404;
  }
  //mongoose duplicate key
  if (err.code === 1100) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exits`;
    statusCode = 400;
  }
  //mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((val) => val.message).join(",");
    statusCode = 400;
  }
  //multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File size exceeds the maximum limit of 10MB";
    statusCode = 400;
  }
  //JWT error
  if (err.name === "JsonwebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.code === "TokenExpireError") {
    message = "Token expired";
    statusCode = 401;
  }

  console.error("Error", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
