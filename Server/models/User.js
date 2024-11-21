const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Student", "Admin", "Uploader", "SuperAdmin"],
      required: true,
    },
    firstName: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },
    lastName: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: 'Please enter a valid 10-digit phone number'
      }
    },
    yearOfJoining: {
      type: Number,
      required: function () {
        return this.role === "Student";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
      // This field will be immutable once set to true
      immutable: function() { return this.isSuperAdmin; }
    },
    otp: [
      {
        code: { type: String, select: false },
        expiration: { type: Date, select: false },
      },
    ],

    eventsRegistered: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    regulations: [String],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // events: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Event",
    // },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret, options) => {
        ret.id = ret._id.toString();
        delete ret._id;
        // Never expose isSuperAdmin field in responses
        delete ret.isSuperAdmin;
        return ret;
      },
    }
  }
);

// Middleware to ensure only one SuperAdmin exists
userSchema.pre('save', async function(next) {
  if (this.role === 'SuperAdmin') {
    const existingSuperAdmin = await this.constructor.findOne({ role: 'SuperAdmin' });
    if (existingSuperAdmin && existingSuperAdmin._id.toString() !== this._id.toString()) {
      throw new Error('Only one Super Admin can exist in the system');
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;