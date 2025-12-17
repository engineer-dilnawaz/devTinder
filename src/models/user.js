const mongose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  JWT_SECRET,
  JWT_EXPIRE,
  ALLOWED_SKILLS_LEGNTH,
  SALT_ROUND,
} = require("../constants/common");
const {
  isValidUrl,
  isStrongPassword,
  isEmailValid,
  capitalizeString,
} = require("../utils/validations");

const userSchema = new mongose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name should contain at least 3 characters."],
      maxLength: [50, "First name cannot be more than 50 characters"],
      set: (value) => capitalizeString(value),
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last name should contain at least 3 characters."],
      maxLength: [50, "Last name cannot be more than 50 characters"],
      set: (value) => capitalizeString(value),
    },
    emailId: {
      type: String,
      lowercase: true,
      required: [true, "Email id is required to create an account."],
      unique: [
        true,
        "You already have registered with this email please try logging in.",
      ],
      trim: true,
      immutable: true,
      validate: {
        validator: function (value) {
          return isEmailValid(value);
        },
        message: (props) => {
          return `Provided '${props.value}' is not a valid email.`;
        },
      },
    },
    password: {
      type: String,
      required: true,

      validate: {
        validator: function (value) {
          return isStrongPassword(value);
        },
        message: (props) => {
          return `Provided '${props.value}' is not a strong password.`;
        },
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported.",
      },
      lowercase: true,
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("Provide gender is not valid");
      //   }
      // },
    },
    profilePhoto: {
      type: String,
      validate: {
        validator: function (value) {
          return isValidUrl(value);
        },
        message: (props) => {
          return `Provided '${props.value}' is not a valid url.`;
        },
      },
    },
    bio: {
      type: String,
      default: "Hardwork beats talent if talent doesn't work hard",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= ALLOWED_SKILLS_LEGNTH;
        },
        message: (props) =>
          `Skills can only be added upto 10. You have provided ${props.value.length} skills`,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add a helper method to User model (userSchema)
userSchema.methods.changePassword = async function (oldPassword, newPassword) {
  // 1️⃣ Validate old password
  const isOldValid = await this.validatePassword(oldPassword);
  if (!isOldValid) {
    throw new Error("Old password is not correct.");
  }

  // 2️⃣ Prevent using same password
  const isSameAsOld = await this.validatePassword(newPassword);
  if (isSameAsOld) {
    throw new Error("New password cannot be the same as the old password.");
  }

  // 3️⃣ Validate password strength
  if (!isStrongPassword(newPassword)) {
    throw new Error(
      "New password is not strong enough. Use min 8 chars, uppercase, lowercase, number, special char."
    );
  }

  // 4️⃣ Hash new password and save
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUND);
  this.password = hashedPassword;
  await this.save({ validateBeforeSave: true });
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongose.model("User", userSchema);

module.exports = User;
