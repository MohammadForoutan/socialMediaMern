const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 80,
    },
    refreshToken: {
      type: String
    },
    avatar: {
      type: String,
      default: "",
    },
    cover: {
      type: String,
      default: "",
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    followings: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    about: {
        type: String,
        max: 70
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: String
    }
  },
  /* model options */
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
