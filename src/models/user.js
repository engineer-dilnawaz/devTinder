const mongose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
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
    profilePhoto: String,
    bio: {
      type: String,
      default: "Hardwork beats talent if talent don't work hard",
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

const User = mongose.model("User", userSchema);

module.exports = User;
