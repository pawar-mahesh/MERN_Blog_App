// custom function to handle the error
export const errorHandler = (statusCode, message) => {
  const err = new Error();
  err.statusCode = statusCode;
  err.message = message;
  return err;
};
