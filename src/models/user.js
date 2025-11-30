const mongose = require("mongoose");
const validator = require("validator");

const userSchema = new mongose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name should contain at least 3 characters."],
      maxLength: 50,
    },
    lastName: String,
    emailId: {
      type: String,
      lowercase: true,
      required: [true, "Email Id is required."],
      unique: true,
      trim: true,
      immutable: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
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
          return validator.isStrongPassword(value);
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
          return validator.isURL(value);
        },
        message: (props) => {
          return `Provided '${props.value}' is not a valid url.`;
        },
      },
    },
    bio: {
      type: String,
      default: "Hardwork beats talent if talent don't work hard",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 10;
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

const User = mongose.model("User", userSchema);

module.exports = User;
