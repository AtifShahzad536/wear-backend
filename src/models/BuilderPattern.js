import mongoose from 'mongoose';

const BuilderPatternSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image_path: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BuilderPattern = mongoose.models.BuilderPattern || mongoose.model('BuilderPattern', BuilderPatternSchema);
