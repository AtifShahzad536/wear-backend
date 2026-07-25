import express from 'express';
import cors from 'cors';
import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import adminWebRoutes from './src/routes/adminWebRoutes.js';
import path from 'path';
import footballRoutes from './src/routes/footballRoutes.js';
import cricketRoutes from './src/routes/cricketRoutes.js';
import basketballRoutes from './src/routes/basketballRoutes.js';
import hockeyRoutes from './src/routes/hockeyRoutes.js';
import rugbyRoutes from './src/routes/rugbyRoutes.js';
import tennisRoutes from './src/routes/tennisRoutes.js';
import runningRoutes from './src/routes/runningRoutes.js';
import gymRoutes from './src/routes/gymRoutes.js';
import wrestlingRoutes from './src/routes/wrestlingRoutes.js';
import shoesRoutes from './src/routes/shoesRoutes.js';
import glovesRoutes from './src/routes/glovesRoutes.js';
import capsRoutes from './src/routes/capsRoutes.js';
import bagsRoutes from './src/routes/bagsRoutes.js';
import homeRoutes from './src/routes/homeRoutes.js';
import inquiryRoutes from './src/routes/inquiryRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import builderRoutes from './src/routes/builderRoutes.js';
import { requireAdmin } from './src/middleware/auth.js';
import { upload } from './src/middleware/upload.js';
import { uploadToCloudinary, isCloudinaryConfigured } from './src/config/cloudinary.js';

import aiRoutes from './src/routes/aiRoutes.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Views (EJS)
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src', 'views'));

// Cache control middleware for static files
const staticOptions = {
  setHeaders: (res, path) => {
    // Set cache control for images (1 year)
    if (/\.(jpg|jpeg|png|gif|ico|svg|webp)$/i.test(path)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    }
  }
};

// Static uploads (primary)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), staticOptions));
// Static uploads (legacy folder fallback: server/server/uploads)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'server', 'uploads'), staticOptions));
// Serve /images from backend uploads folder (alias to uploads)
app.use('/images', express.static(path.resolve(process.cwd(), 'uploads'), staticOptions));
// Serve files under server/service/uploads publicly
app.use('/service/uploads', express.static(path.resolve(process.cwd(), 'service', 'uploads'), staticOptions));

app.use('/api', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
// Public admin login page (EJS)
app.get('/admin/login', (req, res) => {
  res.render('login', { title: 'Admin Login' });
});
// Protected admin APIs and pages
app.use('/api/admin', requireAdmin, adminRoutes);
app.use('/admin', requireAdmin, adminWebRoutes);
app.use('/api/football', footballRoutes);
app.use('/api/cricket', cricketRoutes);
app.use('/api/basketball', basketballRoutes);
app.use('/api/hockey', hockeyRoutes);
app.use('/api/rugby', rugbyRoutes);
app.use('/api/tennis', tennisRoutes);
app.use('/api/running', runningRoutes);
app.use('/api/gym', gymRoutes);
app.use('/api/wrestling', wrestlingRoutes);
app.use('/api/shoes', shoesRoutes);
app.use('/api/gloves', glovesRoutes);
app.use('/api/caps', capsRoutes);
app.use('/api/bags', bagsRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/builder', builderRoutes);
// Public Decal upload route used by frontend 3D Customizer to upload logos and pattern overlays
app.post('/api/decal/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    if (!isCloudinaryConfigured()) {
      const fileUrl = req.file.filename ? `/uploads/${req.file.filename}` : '';
      console.log('[Decal Upload] Cloudinary not configured, using local path', { fileUrl });
      return res.status(200).json({ success: true, url: fileUrl });
    }

    const result = await uploadToCloudinary(req.file, { folder: 'wearconnect/decals' });
    console.log('[Decal Upload] Uploaded to Cloudinary', { url: result.secure_url });
    return res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('[Decal Upload] Upload failed', err);
    res.status(500).json({ success: false, error: 'Upload failed', details: err?.message || String(err) });
  }
});

app.get('/', (req, res) => {
  res.redirect('/admin/login');
});

async function start() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`WearConnect API running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
