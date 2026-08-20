import { Router } from 'express';
import {
  getHome,
  listHomeProducts,
  getHomeProduct,
  adminUpdateHomeCategory,
  adminCreateHomeProduct,
  adminUpdateHomeProduct,
  adminDeleteHomeProduct,
} from '../controllers/homeController.js';
import { HomeSettings } from '../models/Home.js';

const router = Router();

const defaultTopSelling = [
  { name: 'Pro Football Jersey', image: '/uploads/slide1.jpg', link: '/football' },
  { name: 'Cricket ODI Kit', image: '/uploads/slide2.jpg', link: '/cricket' },
  { name: 'Basketball Sleeveless Set', image: '/uploads/slide1.jpg', link: '/basketball' },
  { name: 'Hockey Team Jersey', image: '/uploads/slide2.jpg', link: '/hockey' },
  { name: 'Rugby Pro Shorts', image: '/uploads/slide1.jpg', link: '/rugby' },
  { name: 'Tennis Performance Polo', image: '/uploads/slide2.jpg', link: '/tennis' },
];

// Public
router.get('/', getHome);
router.get('/products/:id', getHomeProduct);
router.get('/topSelling', async (req, res) => {
  const doc = (await HomeSettings.findOne({ key: 'default' }).lean()) || {};
  const topSelling = Array.isArray(doc.topSelling) && doc.topSelling.length ? doc.topSelling : defaultTopSelling;
  res.json({ topSelling });
});
router.get('/settings', async (req, res) => {
  const doc = (await HomeSettings.findOne({ key: 'default' }).lean()) || {};
  const defaultTestimonials = [
    {
      name: "Marcus Miller",
      role: "Head Coach, Austin FC Youth Academy",
      content: "The quality of the sublimated soccer jerseys was outstanding. The colors are incredibly vibrant, and the breathability is exactly what we need for the hot Texas summers. We ordered 150 kits and received them in 2 weeks!",
      rating: 5,
    },
    {
      name: "Sarah Jenkins",
      role: "Athletic Director, Lincoln High School (CA)",
      content: "We ordered custom wrestling singlets and track gear for our varsity teams. Zarko's customer support drafted digital mockups within hours, and the final singlets comply fully with NFHS standards. Highly recommend!",
      rating: 5,
    },
    {
      name: "Dave Richardson",
      role: "role: Founder, Apex Elite Basketball Club (NY)",
      content: "Finding a sportswear manufacturer with low MOQs and export-grade quality was tough until we found Zarko. The material is premium dry-fit, and the stitching is reinforced. Delivery was super fast via DHL.",
      rating: 5,
    },
    {
      name: "Coach Elena Rostova",
      role: "Wrestling Program Coordinator, Chicago Titans",
      content: "Our wrestlers grapple hard, and these custom singlets have stood up to the test. Flatlock seams prevent chafing, and the silicone grip bands are perfect. Outstanding craftsmanship and USD wholesale pricing.",
      rating: 5,
    }
  ];
  res.json({
    customBuilderEnabled: doc.customBuilderEnabled !== false,
    splashEnabled: doc.splashEnabled !== false,
    heroImages: doc.heroImages || [],
    categoryImages: doc.categoryImages || [],
    testimonials: Array.isArray(doc.testimonials) && doc.testimonials.length ? doc.testimonials : defaultTestimonials,
    partners: doc.partners || [],
    valueProps: doc.valueProps || [],
    topSelling: Array.isArray(doc.topSelling) && doc.topSelling.length ? doc.topSelling : defaultTopSelling,
    videos: doc.videos || [],
  });
});

// Admin (CRUD)
router.put('/admin', adminUpdateHomeCategory);
router.post('/admin/products', adminCreateHomeProduct);
router.put('/admin/products/:id', adminUpdateHomeProduct);
router.delete('/admin/products/:id', adminDeleteHomeProduct);

export default router;
