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
    customBuilderEnabled: { type: Boolean, default: true },
    splashEnabled: { type: Boolean, default: true },
    heroImages: { type: [String], default: [] },
    categoryImages: {
      type: [
        new mongoose.Schema(
          {
            slug: { type: String, required: true },
            image: { type: String, default: '' }
          },
          { _id: false }
        )
      ],
      default: []
    },
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
    videos: {
      type: [
        new mongoose.Schema(
          {
            title: { type: String, required: true },
            description: { type: String, default: '' },
            url: { type: String, required: true },
            thumbnailUrl: { type: String, default: '' },
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
