import { v2 as cloudinary } from 'cloudinary';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

export function uploadToCloudinary(file, { folder = 'wearconnect/uploads', resourceType = 'image' } = {}) {
  if (!file) {
    return Promise.reject(new Error('No file provided for Cloudinary upload'));
  }
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error('Cloudinary credentials are not configured'));
  }

  const options = { folder, resource_type: resourceType };

  if (file.mimetype) {
    if (file.mimetype.startsWith('video/')) {
      options.resource_type = 'video';
    } else if (!file.mimetype.startsWith('image/')) {
      options.resource_type = 'auto';
    }
  }

  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(file.buffer);
    });
  }

  if (file.path) {
    return cloudinary.uploader.upload(file.path, options);
  }

  return Promise.reject(new Error('File has no buffer or path for Cloudinary upload'));
}

export default cloudinary;
