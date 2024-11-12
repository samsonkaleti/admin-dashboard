const otpGenerator = require("otp-generator");

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true, // Include only digits
    upperCase: false, // Disable uppercase
    lowerCase: false, // Disable lowercase
    specialChars: false, // Disable special characters
  });
};

module.exports = generateOTP;
