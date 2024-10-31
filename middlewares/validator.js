const { body, param } = require("express-validator");

const validateLogin = [body("identifier").not().isEmpty().trim().escape(), body("password").not().isEmpty().trim().escape()];
const validateSignup = [body("username").not().isEmpty().trim().escape(), body("password").not().isEmpty().trim().escape(), body("email").not().isEmpty().trim().escape()];

module.exports = {
  validateLogin,
  validateSignup,
};
