
const mongoose = require('mongoose');

const { createHmac, randomBytes } = require('node:crypto');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    salt: {
      type: String,
    },
    Password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: './default-profile-pic.jpg',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function () {
  const user = this;
  if (!user.isModified('Password')) {
    return;
  }
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('sha256', salt).update(user.Password).digest('hex');
  user.salt = salt;
  user.Password = hash;
});

const User = model('User', userSchema);
module.exports = { User };
