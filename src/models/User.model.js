const { Schema, model } = require("mongoose");

const UserModel = new Schema(
  {
    full_name: {
      type: String,
      trim: true,
    },
    email:{
        type: String,
        unique: true
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
module.exports = model("users", UserModel)