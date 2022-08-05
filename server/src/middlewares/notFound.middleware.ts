import HttpError from "@exceptions/httpError";

export default () => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
};
