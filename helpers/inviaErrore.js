const inviaErrore = (res, statusCode, errorMessage) => {
  res.status(statusCode).json({
    error: errorMessage,
  });
};

export default inviaErrore;
