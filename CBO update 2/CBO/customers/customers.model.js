const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bed: { type: Number, required: true },
  noOfDays: { type: Number, required: true },
  created: { type: Date, default: Date.now },

  meals: { type: Number, default: 0 },
  clothes: { type: Number, default: 0 },
  gym: { type: Boolean, default: false },

  updated: Date,
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
  },
});

module.exports = mongoose.model('Customer', schema);
