const { GENDER, USER_TYPE } = require("../config/constant");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;


let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  imageUrl:{
    type:String,
  },

  fullName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
  gender: {
    type: String,
    enum: [GENDER.male, GENDER.female],
  },

  type: {
    type: String,
    enum: [USER_TYPE.normal, USER_TYPE.seller, USER_TYPE.admin],
    default: USER_TYPE.normal,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.password) {
    return next();
  }
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};



const User = mongoose.model("User", UserSchema);
module.exports = User;
