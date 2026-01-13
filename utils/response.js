export const success = (res, data, message = "Success") => {
  return res.status(200).json({ status: "success", message, data });
};

export const error = (res, message = "Error", code = 400) => {
  return res.status(code).json({ status: "error", message });
};
