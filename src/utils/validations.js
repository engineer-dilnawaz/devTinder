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

module.exports = {
  isEmailValid,
  isStrongPassword,
  isEmpty,
};
