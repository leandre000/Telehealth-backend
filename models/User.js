const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor','admin'],
    default: 'patient'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  healthMetrics: {
    Pregnancies: { type: Number, default: 0 },
    Glucose: { type: Number, default: 0 },
    BloodPressure: { type: Number, default: 0 },
    SkinThickness: { type: Number, default: 0 },
    Insulin: { type: Number, default: 0 },
    BMI: { type: Number, default: 0 },
    DiabetesPedigreeFunction: { type: Number, default: 0 },
    Age: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('User', UserSchema);
