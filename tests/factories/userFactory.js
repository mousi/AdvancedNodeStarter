const mongoose = require('mongoose');
const User = mongoose.model('User');
const Blog = mongoose.model('Blog');

module.exports = {
  createUser: () => {
    return new User({}).save();
  },
  deleteBlogsByUser: (user) => {
    return Blog.find({ _user: { _id: user._id }}).remove();
  },
  deleteUser: (user) => {
    return User.findByIdAndRemove(user._id);
  }
};
