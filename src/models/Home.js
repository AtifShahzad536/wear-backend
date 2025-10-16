import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    image: { type: String, default: '' },
    quote: { type: String, required: true },
  },
  { _id: false }
);

const HomeSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    heroImages: { type: [String], default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
    partners: { type: [String], default: [] },
    valueProps: {
      type: [
        new mongoose.Schema(
          { title: String, body: String },
          { _id: false }
        ),
      ],
      default: [],
    },
    topSelling: {
      type: [
        new mongoose.Schema(
          {
            id: { type: String, default: '' },
            name: { type: String, required: true },
            image: { type: String, default: '' },
            link: { type: String, default: '' },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const HomeSettings = mongoose.models.HomeSettings || mongoose.model('HomeSettings', HomeSchema);
