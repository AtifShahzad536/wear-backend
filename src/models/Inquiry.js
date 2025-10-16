import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['custom', 'contact'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    message: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
