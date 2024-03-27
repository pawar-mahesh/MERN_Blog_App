// custom function to handle the error
export const errorHandler = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};
