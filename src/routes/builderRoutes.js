import { Router } from 'express';
import { BuilderModel } from '../models/BuilderModel.js';
import { BuilderPattern } from '../models/BuilderPattern.js';
import { BuilderLogo } from '../models/BuilderLogo.js';

const router = Router();

// Get all config for the 3D Customizer / Builder
router.get('/config', async (req, res) => {
  try {
    const { category_id } = req.query;

    const query = { status: true };
    if (category_id) {
      query.category_id = category_id;
    }

    const modelsRaw = await BuilderModel.find(query).sort({ createdAt: -1 }).lean();
    const defaultMapping = {
      'Body': 'primary',
      'Front': 'primary',
      'Back': 'primary',
      'R_Sleeve': 'secondary',
      'L_Sleeve': 'secondary',
      'Neck': 'third',
      'Mesh': 'third',
    };

    const dynamicDesigns = modelsRaw.map(model => ({
      id: 'M' + model._id,
      name: (model.name || '').toUpperCase(),
      modelUrl: model.model_url,
      thumbnail: model.thumbnail,
      mapping: model.mapping && Object.keys(model.mapping).length > 0 ? model.mapping : defaultMapping,
      layers_metadata: model.layers_metadata || {},
    }));

    const patternsRaw = await BuilderPattern.find({ status: true }).sort({ createdAt: -1 }).lean();
    const defaultPatterns = patternsRaw.map(pattern => ({
      id: pattern._id,
      name: pattern.name,
      imageUrl: pattern.image_path,
    }));

    const logosRaw = await BuilderLogo.find({ status: true }).sort({ createdAt: -1 }).lean();
    const defaultLogos = logosRaw.map(logo => ({
      id: logo._id,
      name: logo.name,
      category: logo.category || 'MISC. LOGOS',
      imageUrl: logo.image_path,
    }));

    res.json({
      dynamicDesigns,
      defaultPatterns,
      defaultLogos,
    });
  } catch (err) {
    console.error('Failed to get builder config:', err);
    res.status(500).json({ error: 'Failed to retrieve customizer configuration' });
  }
});

export default router;
