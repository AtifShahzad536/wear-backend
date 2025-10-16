// In-memory seed data. Replace with MongoDB models later.
export const categories = [
  {
    slug: 'football',
    name: 'Football Kits & Apparel',
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-indigo-400',
    featured: {
      name: 'Elite Football Kit Pro',
      image: '/images/slide1.jpg',
      description: 'Elevate your game with our professional football kits. Engineered with cutting-edge fabric technology, these kits provide exceptional breathability, durability, and comfort for match-ready performance on any pitch.',
      details: [
        'Premium polyester fabric for superior comfort',
        'Advanced moisture-wicking technology',
        'Ergonomic fit for unrestricted movement',
        'Sublimation printing for vibrant, long-lasting colors',
        'Reinforced seams for enhanced durability',
        'Lightweight and breathable design',
        'Custom team branding available',
        'Available in full kit or individual pieces',
      ],
      sizes: ['XS','S','M','L','XL','XXL','3XL']
    },
    products: [
      { id: 'fb-1', name: 'Pro Football Kit A', image: '/images/slide1.jpg' },
      { id: 'fb-2', name: 'Pro Football Kit B', image: '/images/slide2.jpg' },
      { id: 'fb-3', name: 'Training Kit', image: '/images/slide1.jpg' },
      { id: 'fb-4', name: 'Goalkeeper Set', image: '/images/slide2.jpg' },
      { id: 'fb-5', name: 'Youth Football Kit', image: '/images/slide1.jpg' },
      { id: 'fb-6', name: 'Away Jersey', image: '/images/slide2.jpg' },
      { id: 'fb-7', name: 'Match Day Bundle', image: '/images/slide1.jpg' },
      { id: 'fb-8', name: 'Training Shorts', image: '/images/slide2.jpg' },
    ]
  },
  {
    slug: 'cricket',
    name: 'Cricket Kits & Apparel',
    gradientFrom: 'from-green-600',
    gradientTo: 'to-green-400',
    featured: {
      name: 'Premium Cricket Kit Pro',
      image: '/images/slide2.jpg',
      description: 'Professional-grade cricket apparel designed for maximum performance. Moisture-wicking, breathable, and reinforced for durability.',
      details: [
        'Advanced moisture-wicking fabric',
        'Breathable mesh panels',
        'Reinforced stitching',
        'Sublimation printing that never fades',
        'Available in custom team colors',
        'UV protection',
        'Quick-dry technology',
        'Custom logo and name printing',
      ],
      sizes: ['XS','S','M','L','XL','XXL','3XL']
    },
    products: [
      { id: 'cr-1', name: 'Cricket Kit A', image: '/images/slide2.jpg' },
      { id: 'cr-2', name: 'Cricket Kit B', image: '/images/slide1.jpg' },
      { id: 'cr-3', name: 'T20 Jersey', image: '/images/slide2.jpg' },
      { id: 'cr-4', name: 'Test Jersey', image: '/images/slide1.jpg' },
      { id: 'cr-5', name: 'ODI Kit Pro', image: '/images/slide2.jpg' },
      { id: 'cr-6', name: 'Training Jersey', image: '/images/slide1.jpg' },
      { id: 'cr-7', name: 'Wicket Keeper Kit', image: '/images/slide2.jpg' },
      { id: 'cr-8', name: 'Team Bundle', image: '/images/slide1.jpg' },
    ]
  },
  {
    slug: 'basketball',
    name: 'Basketball Kits & Apparel',
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-orange-400',
    featured: {
      name: 'Pro Basketball Kit Elite',
      image: '/images/slide1.jpg',
      description: 'Premium basketball uniforms with breathable mesh and moisture-wicking technology for peak performance.',
      details: [
        'Mesh fabric for airflow',
        'Moisture-wicking',
        'Lightweight design',
        'Reinforced stitching',
        'Vibrant sublimation',
        'Custom colors',
        'Quick-dry',
        'Perfect athletic fit',
      ],
      sizes: ['XS','S','M','L','XL','XXL','3XL']
    },
    products: [
      { id: 'bb-1', name: 'Basketball Kit A', image: '/images/slide1.jpg' },
      { id: 'bb-2', name: 'Basketball Kit B', image: '/images/slide2.jpg' },
      { id: 'bb-3', name: 'Slam Dunk Jersey', image: '/images/slide1.jpg' },
      { id: 'bb-4', name: 'Training Shorts', image: '/images/slide2.jpg' },
      { id: 'bb-5', name: 'Pro Basketball Set', image: '/images/slide1.jpg' },
      { id: 'bb-6', name: 'Youth Kit', image: '/images/slide2.jpg' },
      { id: 'bb-7', name: 'Shooting Shirt', image: '/images/slide1.jpg' },
      { id: 'bb-8', name: 'Team Bundle', image: '/images/slide2.jpg' },
    ]
  },
  { slug: 'hockey', name: 'Hockey Kits & Apparel', gradientFrom: 'from-blue-600', gradientTo: 'to-blue-400', featured: { name: 'Pro Hockey Kit Elite', image: '/images/slide2.jpg', description: 'Durable fabrics with flexible panels to keep you agile.', details: ['Abrasion-resistant fabric','Mesh ventilation','Reinforced stitching','Quick-dry','Custom branding','Lightweight','Fade-proof graphics','Full kit or separates'], sizes: ['XS','S','M','L','XL','XXL'] }, products: [ { id: 'hk-1', name: 'Hockey Kit A', image: '/images/slide2.jpg' }, { id: 'hk-2', name: 'Hockey Kit B', image: '/images/slide1.jpg' }, { id: 'hk-3', name: 'Training Jersey', image: '/images/slide2.jpg' }, { id: 'hk-4', name: 'Goalie Set', image: '/images/slide1.jpg' } ] },
  { slug: 'rugby', name: 'Rugby Kits & Apparel', gradientFrom: 'from-rose-600', gradientTo: 'to-rose-400', featured: { name: 'Elite Rugby Kit Pro', image: '/images/slide1.jpg', description: 'Heavy-duty construction with reinforced panels.', details: ['Heavy-duty blend','Reinforced panels','Abrasion-resistant','Enhanced grip','Quick-dry','Durable sublimation','Custom branding','Full-contact design'], sizes: ['XS','S','M','L','XL','XXL','3XL'] }, products: [ { id: 'rb-1', name: 'Rugby Kit A', image: '/images/slide1.jpg' }, { id: 'rb-2', name: 'Rugby Kit B', image: '/images/slide2.jpg' }, { id: 'rb-3', name: 'Training Jersey', image: '/images/slide1.jpg' }, { id: 'rb-4', name: 'Pro Shorts', image: '/images/slide2.jpg' } ] },
  { slug: 'tennis', name: 'Tennis Wear', gradientFrom: 'from-emerald-600', gradientTo: 'to-emerald-400', featured: { name: 'Pro Tennis Kit Elite', image: '/images/slide1.jpg', description: 'Lightweight and breathable for explosive movement.', details: ['Ultra-breathable','Quick-dry','Stretch construction','Flatlock seams','UPF protection','Custom branding','Anti-odor','Sets or separates'], sizes: ['XS','S','M','L','XL','XXL'] }, products: [ { id: 'tn-1', name: 'Tennis Performance Polo', image: '/images/slide1.jpg' }, { id: 'tn-2', name: 'Tennis Skirt/Shorts', image: '/images/slide2.jpg' }, { id: 'tn-3', name: 'Match Jersey', image: '/images/slide1.jpg' }, { id: 'tn-4', name: 'Training Set', image: '/images/slide2.jpg' } ] },
  { slug: 'running', name: 'Running Wear', gradientFrom: 'from-sky-600', gradientTo: 'to-sky-400', featured: { name: 'Elite Running Performance Set', image: '/images/slide1.jpg', description: 'Ultra-lightweight, breathable running apparel.', details: ['Featherweight fabric','Quick-dry','Flatlock seams','Reflective accents','Four-way stretch','Mesh zones','Zip pockets','Custom branding'], sizes: ['XS','S','M','L','XL','XXL'] }, products: [ { id: 'rn-1', name: 'Running Jersey', image: '/images/slide1.jpg' }, { id: 'rn-2', name: 'Compression Tights', image: '/images/slide2.jpg' }, { id: 'rn-3', name: 'Windbreaker Jacket', image: '/images/slide1.jpg' }, { id: 'rn-4', name: 'Lightweight Shorts', image: '/images/slide2.jpg' } ] },
  { slug: 'gym', name: 'Gym Wear & Training Apparel', gradientFrom: 'from-gray-800', gradientTo: 'to-gray-600', featured: { name: 'Premium Gym Wear Set', image: '/images/slide1.jpg', description: 'High-performance fabric technology for intense training.', details: ['Moisture-wicking','Four-way stretch','Anti-odor','Mesh ventilation','Flatlock seams','Lightweight yet durable','Custom branding','Quick-dry anti-pill'], sizes: ['XS','S','M','L','XL','XXL'] }, products: [ { id: 'gm-1', name: 'Gym T-Shirt A', image: '/images/slide1.jpg' }, { id: 'gm-2', name: 'Gym T-Shirt B', image: '/images/slide2.jpg' }, { id: 'gm-3', name: 'Tank Top', image: '/images/slide1.jpg' }, { id: 'gm-4', name: 'Training Shorts', image: '/images/slide2.jpg' } ] },
  { slug: 'shoes', name: 'Shoes', gradientFrom: 'from-zinc-600', gradientTo: 'to-zinc-400', featured: { name: 'Pro Training Shoes', image: '/images/slide2.jpg', description: 'Lightweight traction and breathable upper.', details: ['Breathable mesh','Cushioned midsole','High-traction outsole','Lightweight','Durable upper','Multiple colorways'], sizes: ['38','39','40','41','42','43','44','45'] }, products: [ { id: 'sh-1', name: 'SpeedRunner', image: '/images/slide2.jpg' }, { id: 'sh-2', name: 'CourtPro', image: '/images/slide1.jpg' } ] },
  { slug: 'gloves', name: 'Gloves', gradientFrom: 'from-stone-600', gradientTo: 'to-stone-400', featured: { name: 'GripPro Gloves', image: '/images/slide1.jpg', description: 'Enhanced grip and comfort.', details: ['Non-slip palm','Breathable back','Reinforced seams','Washable'], sizes: ['S','M','L','XL'] }, products: [ { id: 'gl-1', name: 'Training Gloves', image: '/images/slide1.jpg' }, { id: 'gl-2', name: 'Match Gloves', image: '/images/slide2.jpg' } ] },
  { slug: 'caps', name: 'Caps', gradientFrom: 'from-cyan-600', gradientTo: 'to-cyan-400', featured: { name: 'AeroCap', image: '/images/slide2.jpg', description: 'Lightweight cap with ventilation.', details: ['Ventilation mesh','Adjustable strap','Moisture-wicking band'], sizes: ['One Size'] }, products: [ { id: 'cp-1', name: 'AeroCap', image: '/images/slide2.jpg' }, { id: 'cp-2', name: 'Team Cap', image: '/images/slide1.jpg' } ] },
  { slug: 'bags', name: 'Bags', gradientFrom: 'from-fuchsia-600', gradientTo: 'to-fuchsia-400', featured: { name: 'Pro Gear Bag', image: '/images/slide1.jpg', description: 'Spacious and durable gear bag.', details: ['Heavy-duty zippers','Water-resistant','Multiple compartments'], sizes: ['Standard'] }, products: [ { id: 'bg-1', name: 'Pro Gear Bag', image: '/images/slide1.jpg' }, { id: 'bg-2', name: 'Team Duffel', image: '/images/slide2.jpg' } ] },
  { slug: 'wrestling', name: 'Wrestling Singlets & Gear', gradientFrom: 'from-red-600', gradientTo: 'to-red-400', featured: { name: 'Pro Wrestling Singlet Elite', image: '/images/slide1.jpg', description: 'Four-way stretch singlets with reinforced seams.', details: ['Four-way stretch','Moisture-wicking','Flatlock seams','Compression fit','Anti-microbial','Custom colors','Competition-approved'], sizes: ['XS','S','M','L','XL','XXL'] }, products: [ { id: 'wr-1', name: 'Wrestling Singlet A', image: '/images/slide1.jpg' }, { id: 'wr-2', name: 'Wrestling Singlet B', image: '/images/slide2.jpg' } ] },
];

export const allProducts = () => categories.flatMap(c => c.products.map(p => ({ ...p, category: c.slug })));
