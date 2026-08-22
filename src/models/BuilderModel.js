import mongoose from 'mongoose';

const BuilderModelSchema = new mongoose.Schema(
  {
    category_id: { type: String, required: true }, // maps to category slug or id
    name: { type: String, required: true },
    model_url: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    uv_view: { type: String, default: '' },   // UV texture layout image URL
    flat_view: { type: String, default: '' }, // 2D flat/front-back diagram image URL
    mapping: { type: mongoose.Schema.Types.Mixed, default: {} },
    layers_metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BuilderModel = mongoose.models.BuilderModel || mongoose.model('BuilderModel', BuilderModelSchema);
