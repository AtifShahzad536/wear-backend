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
import { requireAdmin } from './src/middleware/auth.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views (EJS)
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src', 'views'));

// Static uploads (primary)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
// Static uploads (legacy folder fallback: server/server/uploads)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'server', 'uploads')));
// Serve /images from backend uploads folder (alias to uploads)
app.use('/images', express.static(path.resolve(process.cwd(), 'uploads')));
// Serve files under server/service/uploads publicly
app.use('/service/uploads', express.static(path.resolve(process.cwd(), 'service', 'uploads')));

app.use('/api', categoryRoutes);
app.use('/api/auth', authRoutes);
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
