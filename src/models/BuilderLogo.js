import mongoose from 'mongoose';

const BuilderLogoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'MISC. LOGOS' },
    image_path: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BuilderLogo = mongoose.models.BuilderLogo || mongoose.model('BuilderLogo', BuilderLogoSchema);
