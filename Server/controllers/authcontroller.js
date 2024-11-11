const User = require("../models/User");
const College = require("../models/Colleges");
const generateOTP = require("../utils/otpGenerator");
const { sendOTP } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redisClient = require("../config/redis"); // Redis client

// User Signup
exports.signup = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    yearOfJoining,
    firstName,
    lastName,
    phoneNo,
    selectedRegulation,
  } = req.body;

  try {
    // Check if email is a college domain (adjust the domain as needed)
    const collegeDomain = "@college.edu";
    if (!email.endsWith(collegeDomain)) {
      return res
        .status(400)
        .json({ message: "Email must be a college domain email" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update their details if they are a student
      if (user.role.toLowerCase() !== "student") {
        return res.status(400).json({
          message:
            "User already exists and is not a student. Cannot update details.",
        });
      }

      // Validate required fields for students
      if (!firstName || !lastName || !phoneNo || !selectedRegulation) {
        return res.status(400).json({
          message:
            "Missing required fields for updating student details: firstName, lastName, phoneNo, selectedRegulation",
        });
      }

      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNo)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit phone number",
        });
      }

      // Extract domain and find college
      const userDomain = email.split("@")[1];
      const college = await College.findOne({ domain: userDomain });
      if (!college) {
        return res.status(400).json({
          message: "Domain not matching with any college.",
        });
      }

      // Fetch regulations from the college
      const regulations = college.programs.flatMap((program) =>
        program.regulations.map((reg) => reg.regulation)
      );

      // Validate selected regulation
      if (!regulations.includes(selectedRegulation)) {
        return res
          .status(400)
          .json({ message: "Selected regulation is not valid." });
      }

      // Update user details
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phoneNo;
      user.regulations = selectedRegulation;

      // Verify the user if not a student
      // (Assuming admins and uploaders are already verified during signup)

      await user.save();

      return res.status(200).json({
        message: "User details updated successfully",
        regulations,
      });
    } else {
      // If user does not exist, proceed with signup
      const { username, email, password, role, yearOfJoining } = req.body;

      // Validate required fields for signup
      if (!username || !email || !password || !role || !yearOfJoining) {
        return res.status(400).json({
          message:
            "Missing required fields for signup: username, email, password, role, yearOfJoining",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Determine if the user is a student
      const isStudent = role.toLowerCase() === "student";

      // Create new user object
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(), // Capitalize role
        yearOfJoining,
        isVerified: isStudent ? false : true, // Admins and uploaders are automatically verified
      });

      // Save user to the database
      await newUser.save();

      // If the user is a student, handle user details and OTP
      if (isStudent) {
        const { firstName, lastName, phoneNo, selectedRegulation } = req.body;

        // Validate required fields for students
        if (!firstName || !lastName || !phoneNo || !selectedRegulation) {
          return res.status(400).json({
            message:
              "Missing required fields for student signup: firstName, lastName, phoneNo, selectedRegulation",
          });
        }

        // Validate phone number format
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNo)) {
          return res.status(400).json({
            message: "Please enter a valid 10-digit phone number",
          });
        }

        // Extract domain and find college
        const userDomain = email.split("@")[1];
        const college = await College.findOne({ domain: userDomain });
        if (!college) {
          return res.status(400).json({
            message: "Domain not matching with any college.",
          });
        }

        // Fetch regulations from the college
        const regulations = college.programs.flatMap((program) =>
          program.regulations.map((reg) => reg.regulation)
        );

        // Validate selected regulation
        if (!regulations.includes(selectedRegulation)) {
          return res
            .status(400)
            .json({ message: "Selected regulation is not valid." });
        }

        // Update user details
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.phone = phoneNo;
        newUser.regulations = selectedRegulation;

        // Generate and send OTP
        const otp = generateOTP();
        console.log(`Generated OTP for ${email}: ${otp}`); // For debugging purposes
        await sendOTP(newUser.email, otp); // Implement this function to send OTP via email

        // Store OTP and its expiration time in the user model
        newUser.otp.push({
          code: otp,
          expiration: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
        });

        await newUser.save();

        return res.status(201).json({
          message: "User registered successfully, OTP sent to email",
          userId: newUser._id,
        });
      }

      // For non-student users
      return res.status(201).json({
        message: "User registered successfully",
        userId: newUser._id,
      });
    }
  } catch (error) {
    console.error("Signup Error:", error);

    if (error.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided OTP exists and is not expired
    const otpEntry = user.otp.find(
      (entry) => entry.code === otp && entry.expiration > Date.now()
    );

    if (otpEntry) {
      // Update the user's isVerified status
      user.isVerified = true;

      // Remove the used OTP from the array
      user.otp = user.otp.filter((entry) => entry.code !== otp); // Remove the used OTP
      await user.save();

      return res
        .status(200)
        .json({ message: "OTP verified successfully, you can now log in" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

// exports.userDetails = async (req, res) => {
//   const { firstName, lastName, phoneNo, email, selectedRegulation } = req.body;
//   const userDomain = email.split("@")[1]; // Extract domain from email
//   console.log("User Domain: " + userDomain);

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the user is a student or an admin/uploader
//     const isStudent = user.role === "student";

//     // Find college by domain
//     const college = await College.findOne({ domain: userDomain });
//     if (!college) {
//       return res
//         .status(400)
//         .json({ message: "Domain not matching with any college." });
//     }

//     // Fetch only regulation names from the college model
//     const regulations = college.programs.flatMap(
//       (program) => program.regulations.map((reg) => reg.regulation) // Extract only regulation names
//     );

//     // Check if the selected regulation is valid
//     if (!regulations.includes(selectedRegulation)) {
//       return res
//         .status(400)
//         .json({ message: "Selected regulation is not valid." });
//     }

//     // Update user fields with provided details
//     user.firstName = firstName;
//     user.lastName = lastName;
//     user.phone = phoneNo;

//     // Add the selected regulation to the user's regulations array
//     user.regulations = selectedRegulation;

//     // Verify the user for admins and uploaders
//     if (!isStudent) {
//       user.isVerified = true;
//     }

//     await user.save(); // Save updated user profile

//     return res.status(200).json({
//       regulations,
//       message: "User details updated successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error fetching regulations",
//       error: error.message,
//     });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(req.body); // Log the request body to ensure both email and password are provided

    const user = await User.findOne({ email }).select("+password"); // Explicitly include password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log password and hash for debugging
    console.log("Entered password:", password);
    console.log("Stored hash password:", user.password);

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "User not verified. Please verify the OTP sent to your email",
      });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If verified and password is correct, generate a JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    sessionStorage.setItem("auth_token", token);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};
