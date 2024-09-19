import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});


passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);


export default PasswordReset;
