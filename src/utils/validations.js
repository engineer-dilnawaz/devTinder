const validator = require("validator");

const isEmailValid = (emailId) => {
  return validator.isEmail(emailId);
};

const isStrongPassword = (password) => {
  return validator.isStrongPassword(password);
};

const isEmpty = (string) => {
  return validator.isEmpty(string, {
    ignore_whitespace: true,
  });
};

const isValidUrl = (string) => {
  return validator.isURL(string);
};

const isEmptyArray = (arr) => {
  return arr.length === 0;
};

const capitalizeString = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const validateProfileEdits = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "bio",
    "skills",
    "age",
    "gender",
    "profilePhoto",
  ];

  if (!req.body) {
    return false;
  }

  if (isEmptyArray(Object.keys(req.body))) {
    return false;
  }

  const isValidRequest = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isValidRequest;
};

const validatePasswordUpdate = (req) => {
  const allowedFieldsUpdate = ["oldPassword", "newPassword"];

  const hasValidRequestBody = Object.keys(req.body).every((field) =>
    allowedFieldsUpdate.includes(field)
  );

  const hasStrongPassword = isStrongPassword(req.body.newPassword);

  return hasValidRequestBody && hasStrongPassword;
};

module.exports = {
  isEmailValid,
  isStrongPassword,
  isEmpty,
  isValidUrl,
  capitalizeString,
  validateProfileEdits,
  validatePasswordUpdate,
};
