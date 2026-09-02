// ─── IMAGE ASSETS ─────────────────────────────────────────────────────────────
// NOTE: All product images below use existing boutique assets.
// Replace each product's `images[]` with real product photography when available.
import sarees from "@/assets/cat-sarees.jpg";
import ethnic from "@/assets/cat-ethnic.jpg";
import casual from "@/assets/cat-casual.jpg";
import bridal from "@/assets/cat-bridal.jpg";
import custom from "@/assets/cat-custom.jpg";
import hero from "@/assets/hero-bride.jpg";
import confidence from "@/assets/story-confidence.jpg";
import thread from "@/assets/story-thread.jpg";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type Category =
  | "Kerala Bridal Wear"
  | "Silk Sarees"
  | "Kasavu Sarees"
  | "Designer Sarees"
  | "Churidar Sets"
  | "Kurtis"
  | "Festive Wear"
  | "Reception Wear"
  | "Kids Ethnic Wear"
  | "Bridal Lehengas"
  | "Custom Stitching";

export type Occasion =
  | "Wedding"
  | "Reception"
  | "Onam & Vishu"
  | "Daily Wear"
  | "College"
  | "Party"
  | "Festive"
  | "Bridal";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  occasions: Occasion[];
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  inStock: boolean;
  stockCount: number;
  tag?: string; // "New" | "Bestseller" | "Sale" | "Signature"
  description: string;
  fabricDetails: string;
  careInstructions: string;
  deliveryDays: string;
  isNew: boolean;
  isBestseller: boolean;
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const categories: {
  name: Category;
  image: string;
  blurb: string;
  slug: string;
  startingFrom: number;
}[] = [
  {
    name: "Kerala Bridal Wear",
    image: bridal,
    blurb: "Traditional Kerala bridal sarees and kasavu sets for your wedding day.",
    slug: "kerala-bridal-wear",
    startingFrom: 18000,
  },
  {
    name: "Silk Sarees",
    image: sarees,
    blurb: "Pure Kanjivaram and Banarasi silk sarees with authentic gold borders.",
    slug: "silk-sarees",
    startingFrom: 8500,
  },
  {
    name: "Kasavu Sarees",
    image: sarees,
    blurb: "Authentic Kerala kasavu sarees in cream and gold — perfect for every occasion.",
    slug: "kasavu-sarees",
    startingFrom: 3500,
  },
  {
    name: "Designer Sarees",
    image: confidence,
    blurb: "Contemporary designer sarees with beautiful embroidery and modern styling.",
    slug: "designer-sarees",
    startingFrom: 5000,
  },
  {
    name: "Churidar Sets",
    image: ethnic,
    blurb: "Elegant churidar and salwar sets for every occasion — from daily to festive.",
    slug: "churidar-sets",
    startingFrom: 2200,
  },
  {
    name: "Kurtis",
    image: casual,
    blurb: "Stylish kurtis in cotton, silk, and festive fabrics for everyday and special wear.",
    slug: "kurtis",
    startingFrom: 1200,
  },
  {
    name: "Festive Wear",
    image: ethnic,
    blurb: "Beautiful outfits for Onam, Vishu, Eid, and every celebration.",
    slug: "festive-wear",
    startingFrom: 3000,
  },
  {
    name: "Reception Wear",
    image: confidence,
    blurb: "Stand-out reception outfits — gowns, concept sarees, and Indo-Western styles.",
    slug: "reception-wear",
    startingFrom: 7500,
  },
  {
    name: "Kids Ethnic Wear",
    image: casual,
    blurb: "Adorable ethnic outfits for little ones — pavada, churidar, and festive dresses.",
    slug: "kids-ethnic-wear",
    startingFrom: 1500,
  },
  {
    name: "Bridal Lehengas",
    image: hero,
    blurb: "Grand wedding lehengas with zardozi and threadwork for an unforgettable entrance.",
    slug: "bridal-lehengas",
    startingFrom: 35000,
  },
  {
    name: "Custom Stitching",
    image: custom,
    blurb: "Your design stitched to your exact measurements — blouses, churidars, and more.",
    slug: "custom-stitching",
    startingFrom: 800,
  },
];

// ─── OCCASIONS ────────────────────────────────────────────────────────────────
export const occasions: { name: Occasion; image: string; desc: string }[] = [
  { name: "Wedding", image: bridal, desc: "Bridal sarees, lehengas & wedding sets" },
  { name: "Onam & Vishu", image: sarees, desc: "Kasavu sarees & traditional sets" },
  { name: "Reception", image: confidence, desc: "Evening gowns & concept sarees" },
  { name: "Party", image: ethnic, desc: "Designer sarees & party kurtis" },
  { name: "Daily Wear", image: casual, desc: "Comfortable kurtis & churidars" },
  { name: "Festive", image: ethnic, desc: "Churidars, salwars & festive sets" },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const products: Product[] = [
  // ── KERALA BRIDAL WEAR ──────────────────────────────────────────────────────
  {
    id: "kb-001",
    name: "Kerala Bridal Kasavu Saree",
    category: "Kerala Bridal Wear",
    occasions: ["Wedding", "Bridal"],
    price: 22000,
    images: [bridal, sarees, thread],
    sizes: ["Free Size"],
    colors: [{ name: "Cream & Gold", hex: "#D4AF37" }],
    inStock: true,
    stockCount: 5,
    tag: "Signature",
    description: "A timeless Kerala bridal kasavu saree woven in cream and pure gold zari. Rich texture, wide border, and a pallu that drapes beautifully for your most important day.",
    fabricDetails: "Pure Cotton with Gold Zari Border. Length: 5.5 metres including blouse piece.",
    careInstructions: "Dry clean only. Store folded in cotton cloth.",
    deliveryDays: "5–7 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "kb-002",
    name: "Bridal Silk Pattu Saree",
    category: "Kerala Bridal Wear",
    occasions: ["Wedding", "Bridal"],
    price: 32000,
    images: [bridal, hero, sarees],
    sizes: ["Free Size"],
    colors: [
      { name: "Deep Red", hex: "#8B0000" },
      { name: "Royal Blue", hex: "#2B4590" },
    ],
    inStock: true,
    stockCount: 3,
    tag: "Signature",
    description: "Pure silk pattu saree with heavy gold zari work throughout. Perfect for a Kerala wedding or engagement ceremony.",
    fabricDetails: "Pure Silk with Zari Work. Length: 6 metres with blouse piece.",
    careInstructions: "Dry clean only. Store in silk bag away from moisture.",
    deliveryDays: "5–7 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "kb-003",
    name: "Kerala Wedding Kasavu Set",
    category: "Kerala Bridal Wear",
    occasions: ["Wedding", "Bridal"],
    price: 28000,
    images: [sarees, bridal, thread],
    sizes: ["Free Size"],
    colors: [{ name: "White & Gold", hex: "#F5F5DC" }],
    inStock: true,
    stockCount: 4,
    tag: "New",
    description: "A complete Kerala wedding set — matching kasavu saree and blouse fabric in premium cotton. Wide golden border and traditional design throughout.",
    fabricDetails: "Premium Kerala Cotton, Gold Zari. Set includes saree + matching blouse fabric.",
    careInstructions: "Gentle hand wash or dry clean. Avoid direct sunlight storage.",
    deliveryDays: "5–7 working days",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "kb-004",
    name: "Gold & Ivory Bridal Saree",
    category: "Kerala Bridal Wear",
    occasions: ["Wedding", "Bridal", "Reception"],
    price: 26000,
    originalPrice: 29000,
    images: [sarees, bridal, confidence],
    sizes: ["Free Size"],
    colors: [{ name: "Ivory & Gold", hex: "#FFFFF0" }],
    inStock: true,
    stockCount: 3,
    tag: "Sale",
    description: "Ivory silk saree with intricate gold embroidery throughout the pallu and border. A versatile bridal saree that works for both the wedding ceremony and reception.",
    fabricDetails: "Pure Silk, Hand Embroidered Gold Work. Length: 5.5 metres.",
    careInstructions: "Dry clean only.",
    deliveryDays: "5–7 working days",
    isNew: false,
    isBestseller: false,
  },

  // ── SILK SAREES ─────────────────────────────────────────────────────────────
  {
    id: "ss-001",
    name: "Emerald Kanjivaram Silk Saree",
    category: "Silk Sarees",
    occasions: ["Wedding", "Festive", "Party"],
    price: 18900,
    images: [sarees, confidence, thread],
    sizes: ["Free Size"],
    colors: [
      { name: "Emerald Green", hex: "#50C878" },
      { name: "Deep Teal", hex: "#008080" },
    ],
    inStock: true,
    stockCount: 6,
    tag: "New",
    description: "Hand-loomed pure Kanjivaram silk saree in rich emerald green with authentic gold zari border and a beautiful peacock motif pallu.",
    fabricDetails: "Pure Kanjivaram Silk, Authentic Gold Zari. Length: 6 metres with blouse piece.",
    careInstructions: "Dry clean only. Store flat, folded in muslin cloth.",
    deliveryDays: "3–5 working days",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "ss-002",
    name: "Crimson Banarasi Silk Saree",
    category: "Silk Sarees",
    occasions: ["Wedding", "Festive"],
    price: 22500,
    images: [sarees, bridal, thread],
    sizes: ["Free Size"],
    colors: [
      { name: "Deep Crimson", hex: "#DC143C" },
      { name: "Maroon", hex: "#800000" },
    ],
    inStock: true,
    stockCount: 4,
    tag: "Bestseller",
    description: "Rich Banarasi silk saree woven in Varanasi with genuine silver and gold brocade work. A classic choice for weddings and formal occasions.",
    fabricDetails: "Pure Banarasi Silk, Silver & Gold Brocade. Length: 5.5 metres.",
    careInstructions: "Dry clean only. Handle with care.",
    deliveryDays: "5–7 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "ss-003",
    name: "Navy Blue Kanjivaram Saree",
    category: "Silk Sarees",
    occasions: ["Wedding", "Reception", "Party"],
    price: 16500,
    images: [confidence, sarees, thread],
    sizes: ["Free Size"],
    colors: [
      { name: "Navy Blue", hex: "#1B3A6B" },
      { name: "Royal Blue", hex: "#4169E1" },
    ],
    inStock: true,
    stockCount: 5,
    tag: "Bestseller",
    description: "Elegant navy blue Kanjivaram silk saree with contrasting gold border and traditional temple design throughout the fabric.",
    fabricDetails: "Pure Kanjivaram Silk, Zari Work. Length: 6 metres with blouse piece.",
    careInstructions: "Dry clean only.",
    deliveryDays: "3–5 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "ss-004",
    name: "Rose Gold Mysore Silk Saree",
    category: "Silk Sarees",
    occasions: ["Reception", "Party", "Festive"],
    price: 14800,
    images: [sarees, confidence, bridal],
    sizes: ["Free Size"],
    colors: [
      { name: "Rose Gold", hex: "#B76E79" },
      { name: "Blush Pink", hex: "#FFB6C1" },
    ],
    inStock: true,
    stockCount: 7,
    tag: "New",
    description: "Soft Mysore silk saree in a beautiful rose gold shade with delicate golden border. Light, comfortable, and elegant for any occasion.",
    fabricDetails: "Pure Mysore Silk, Zari Border. Length: 5.5 metres.",
    careInstructions: "Dry clean recommended. Gentle hand wash is acceptable.",
    deliveryDays: "3–5 working days",
    isNew: true,
    isBestseller: false,
  },

  // ── KASAVU SAREES ───────────────────────────────────────────────────────────
  {
    id: "ks-001",
    name: "Traditional Gold Kasavu Saree",
    category: "Kasavu Sarees",
    occasions: ["Onam & Vishu", "Wedding", "Festive"],
    price: 5500,
    images: [sarees, bridal, thread],
    sizes: ["Free Size"],
    colors: [{ name: "Cream & Gold", hex: "#D4AF37" }],
    inStock: true,
    stockCount: 12,
    tag: "Bestseller",
    description: "Authentic Kerala kasavu saree in traditional cream and gold. Perfect for Onam, Vishu, family occasions, and weddings. Soft texture and beautiful drape.",
    fabricDetails: "Kerala Cotton with Gold Zari Border. Length: 5.5 metres with blouse piece.",
    careInstructions: "Gentle hand wash in cold water. Do not wring. Dry in shade.",
    deliveryDays: "3–5 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "ks-002",
    name: "Onam Special Cotton Kasavu",
    category: "Kasavu Sarees",
    occasions: ["Onam & Vishu", "Festive"],
    price: 3800,
    images: [sarees, thread, confidence],
    sizes: ["Free Size"],
    colors: [{ name: "White & Gold", hex: "#F8F5F0" }],
    inStock: true,
    stockCount: 15,
    tag: "Seasonal",
    description: "Light and comfortable cotton kasavu saree perfect for Onam celebrations. Pure white with single gold border — traditional and elegant.",
    fabricDetails: "Pure Kerala Cotton, Single Gold Zari Border. Length: 5.5 metres.",
    careInstructions: "Machine wash in gentle cycle. Iron on medium heat.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: false,
  },
  {
    id: "ks-003",
    name: "Double Kasavu Wedding Saree",
    category: "Kasavu Sarees",
    occasions: ["Wedding", "Onam & Vishu"],
    price: 8200,
    images: [bridal, sarees, thread],
    sizes: ["Free Size"],
    colors: [{ name: "Cream & Double Gold", hex: "#D4AF37" }],
    inStock: true,
    stockCount: 8,
    tag: "Signature",
    description: "Premium double kasavu saree with wide gold borders on both sides. A popular choice for Kerala weddings — rich looking with a beautiful traditional feel.",
    fabricDetails: "Premium Kerala Cotton, Double Width Gold Zari. Length: 6 metres.",
    careInstructions: "Dry clean recommended for the first few washes.",
    deliveryDays: "3–5 working days",
    isNew: false,
    isBestseller: true,
  },

  // ── DESIGNER SAREES ─────────────────────────────────────────────────────────
  {
    id: "ds-001",
    name: "Navy Embroidered Georgette Saree",
    category: "Designer Sarees",
    occasions: ["Reception", "Party", "Festive"],
    price: 8900,
    images: [confidence, ethnic, sarees],
    sizes: ["Free Size"],
    colors: [
      { name: "Navy Blue", hex: "#1B3A6B" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    inStock: true,
    stockCount: 9,
    tag: "New",
    description: "Contemporary georgette saree with delicate thread embroidery throughout. Light, flowing fabric perfect for reception events and parties.",
    fabricDetails: "Pure Georgette, Thread Embroidery. Length: 5.5 metres with blouse piece.",
    careInstructions: "Dry clean only.",
    deliveryDays: "3–5 working days",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "ds-002",
    name: "Floral Print Chiffon Saree",
    category: "Designer Sarees",
    occasions: ["Party", "Daily Wear", "Festive"],
    price: 5200,
    images: [confidence, sarees, ethnic],
    sizes: ["Free Size"],
    colors: [
      { name: "Blush Pink", hex: "#FFB6C1" },
      { name: "Sky Blue", hex: "#87CEEB" },
    ],
    inStock: true,
    stockCount: 11,
    tag: "Bestseller",
    description: "Lightweight chiffon saree with an elegant floral print. Easy to drape, comfortable for long events, and beautiful in photographs.",
    fabricDetails: "Pure Chiffon, Digital Print. Length: 5.5 metres with unstitched blouse.",
    careInstructions: "Gentle machine wash or hand wash in cold water.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "ds-003",
    name: "Sequin Work Party Saree",
    category: "Designer Sarees",
    occasions: ["Party", "Reception"],
    price: 9800,
    images: [confidence, ethnic, bridal],
    sizes: ["Free Size"],
    colors: [
      { name: "Black & Gold", hex: "#1A1A1A" },
      { name: "Wine", hex: "#722F37" },
    ],
    inStock: true,
    stockCount: 6,
    tag: "New",
    description: "Glamorous saree with scattered sequin work on a rich fabric base. Perfect for evening parties and reception events — stands out in any crowd.",
    fabricDetails: "Net with Sequin Work, Silk Lining. Length: 5.5 metres.",
    careInstructions: "Dry clean only.",
    deliveryDays: "3–5 working days",
    isNew: true,
    isBestseller: false,
  },

  // ── CHURIDAR SETS ───────────────────────────────────────────────────────────
  {
    id: "cs-001",
    name: "Floral Printed Churidar Set",
    category: "Churidar Sets",
    occasions: ["Daily Wear", "College", "Festive"],
    price: 3200,
    images: [ethnic, casual, confidence],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Blue & White", hex: "#4169E1" },
      { name: "Green & White", hex: "#228B22" },
    ],
    inStock: true,
    stockCount: 20,
    tag: "Bestseller",
    description: "Pretty floral printed churidar set with matching dupatta. Light, comfortable cotton fabric perfect for daily wear and college.",
    fabricDetails: "Pure Cotton, Digital Print. Set: Kurta + Churidar + Dupatta.",
    careInstructions: "Machine wash in cold water.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "cs-002",
    name: "Embroidered Salwar Set",
    category: "Churidar Sets",
    occasions: ["Festive", "Party"],
    price: 4800,
    images: [ethnic, confidence, casual],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Peacock Blue", hex: "#005F6B" },
      { name: "Burgundy", hex: "#800020" },
    ],
    inStock: true,
    stockCount: 14,
    tag: "New",
    description: "Beautifully embroidered salwar set with heavy neck and sleeve embroidery. Perfect for festive occasions and family functions.",
    fabricDetails: "Georgette with Thread Embroidery. Set: Kurta + Salwar + Dupatta.",
    careInstructions: "Dry clean recommended. Gentle hand wash acceptable.",
    deliveryDays: "2–4 working days",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "cs-003",
    name: "Silk Churidar for Wedding",
    category: "Churidar Sets",
    occasions: ["Wedding", "Festive"],
    price: 5500,
    images: [ethnic, bridal, confidence],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Gold", hex: "#D4AF37" },
      { name: "Magenta", hex: "#FF00FF" },
      { name: "Coral", hex: "#FF6B6B" },
    ],
    inStock: true,
    stockCount: 10,
    tag: "Bestseller",
    description: "Premium silk churidar set for weddings and special occasions. Rich fabric with beautiful sheen, embroidered neck piece, and matching dupatta.",
    fabricDetails: "Raw Silk, Embroidered. Set includes kurta, churidar, and embroidered dupatta.",
    careInstructions: "Dry clean only.",
    deliveryDays: "3–5 working days",
    isNew: false,
    isBestseller: true,
  },

  // ── KURTIS ──────────────────────────────────────────────────────────────────
  {
    id: "kt-001",
    name: "Cotton Block Print Kurti",
    category: "Kurtis",
    occasions: ["Daily Wear", "College"],
    price: 1800,
    images: [casual, ethnic, confidence],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Indigo Blue", hex: "#4B0082" },
      { name: "Rust Orange", hex: "#B7410E" },
      { name: "Forest Green", hex: "#228B22" },
    ],
    inStock: true,
    stockCount: 30,
    tag: "Bestseller",
    description: "Comfortable pure cotton kurti with traditional block print design. Perfect for daily wear, college, and casual outings.",
    fabricDetails: "100% Pure Cotton, Block Print.",
    careInstructions: "Machine wash in cold water. Iron on medium heat.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "kt-002",
    name: "Silk Embroidered Kurti",
    category: "Kurtis",
    occasions: ["Festive", "Party"],
    price: 3200,
    images: [casual, ethnic, confidence],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Teal", hex: "#008080" },
      { name: "Deep Rose", hex: "#C71585" },
    ],
    inStock: true,
    stockCount: 15,
    tag: "New",
    description: "Elegant silk kurti with hand embroidery at the neck and hem. Beautiful enough for festivals, comfortable enough for regular wear.",
    fabricDetails: "Pure Silk, Hand Embroidery.",
    careInstructions: "Dry clean recommended.",
    deliveryDays: "2–4 working days",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "kt-003",
    name: "Linen Casual Kurti",
    category: "Kurtis",
    occasions: ["Daily Wear", "College"],
    price: 1500,
    images: [casual, ethnic, confidence],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Off White", hex: "#FAF9F6" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Light Grey", hex: "#D3D3D3" },
    ],
    inStock: true,
    stockCount: 25,
    description: "Lightweight linen kurti — breathable, comfortable, and stylish for everyday wear in Kerala's warm weather.",
    fabricDetails: "Pure Linen.",
    careInstructions: "Machine wash in cold water. Air dry.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: false,
  },

  // ── FESTIVE WEAR ─────────────────────────────────────────────────────────────
  {
    id: "fw-001",
    name: "Onam Special Kasavu Set",
    category: "Festive Wear",
    occasions: ["Onam & Vishu", "Festive"],
    price: 4200,
    images: [ethnic, sarees, casual],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [{ name: "White & Gold", hex: "#F8F5F0" }],
    inStock: true,
    stockCount: 18,
    tag: "Seasonal",
    description: "Complete Onam set — matching kasavu churidar and top with gold border trim. Traditional Kerala style for the harvest festival.",
    fabricDetails: "Kerala Cotton with Gold Kasavu Border. Set: Top + Churidar.",
    careInstructions: "Gentle hand wash or machine wash in cold water.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "fw-002",
    name: "Vishu Festive Churidar",
    category: "Festive Wear",
    occasions: ["Onam & Vishu", "Festive"],
    price: 3500,
    images: [ethnic, casual, confidence],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Yellow & Gold", hex: "#FFD700" },
      { name: "Green & Gold", hex: "#228B22" },
    ],
    inStock: true,
    stockCount: 12,
    tag: "Seasonal",
    description: "Bright and beautiful churidar set for Vishu and other festive occasions. Vibrant colour with kasavu-inspired gold trim.",
    fabricDetails: "Cotton Blend, Gold Trim.",
    careInstructions: "Machine wash in cold water.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: false,
  },
  {
    id: "fw-003",
    name: "Eid Special Designer Set",
    category: "Festive Wear",
    occasions: ["Festive", "Party"],
    price: 4800,
    images: [ethnic, confidence, bridal],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Mint Green", hex: "#98FF98" },
      { name: "Lavender", hex: "#E6E6FA" },
      { name: "Peach", hex: "#FFDAB9" },
    ],
    inStock: true,
    stockCount: 10,
    tag: "New",
    description: "Elegant designer churidar set for Eid and festive celebrations. Lightweight fabric with delicate floral print and matching dupatta.",
    fabricDetails: "Georgette with Print, Matching Dupatta.",
    careInstructions: "Gentle hand wash or dry clean.",
    deliveryDays: "2–4 working days",
    isNew: true,
    isBestseller: false,
  },

  // ── RECEPTION WEAR ───────────────────────────────────────────────────────────
  {
    id: "rw-001",
    name: "Reception Anarkali Gown",
    category: "Reception Wear",
    occasions: ["Reception", "Party"],
    price: 12500,
    images: [confidence, bridal, ethnic],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Emerald", hex: "#50C878" },
      { name: "Wine", hex: "#722F37" },
    ],
    inStock: true,
    stockCount: 8,
    tag: "Bestseller",
    description: "Stunning floor-length anarkali gown for wedding receptions. Heavy embroidery work, flowing fabric, and an elegant silhouette that photographs beautifully.",
    fabricDetails: "Net with Silk Inner, Thread & Stone Work.",
    careInstructions: "Dry clean only.",
    deliveryDays: "3–5 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "rw-002",
    name: "Indo-Western Concept Saree",
    category: "Reception Wear",
    occasions: ["Reception", "Party"],
    price: 11200,
    images: [confidence, sarees, bridal],
    sizes: ["Free Size"],
    colors: [
      { name: "Black & Gold", hex: "#1A1A1A" },
      { name: "Navy & Silver", hex: "#1B3A6B" },
    ],
    inStock: true,
    stockCount: 5,
    tag: "New",
    description: "A modern concept saree that combines traditional draping with contemporary styling. Pre-stitched for ease of wearing — perfect for reception events.",
    fabricDetails: "Premium Georgette, Embellished Border.",
    careInstructions: "Dry clean only.",
    deliveryDays: "3–5 working days",
    isNew: true,
    isBestseller: false,
  },

  // ── KIDS ETHNIC WEAR ────────────────────────────────────────────────────────
  {
    id: "ke-001",
    name: "Kids Pavada & Blouse Set",
    category: "Kids Ethnic Wear",
    occasions: ["Onam & Vishu", "Wedding", "Festive"],
    price: 2200,
    images: [casual, ethnic, bridal],
    sizes: ["1-2 Yrs", "2-3 Yrs", "3-4 Yrs", "4-5 Yrs", "5-6 Yrs", "6-7 Yrs"],
    colors: [
      { name: "Pink & Gold", hex: "#FFB6C1" },
      { name: "Yellow & Gold", hex: "#FFD700" },
    ],
    inStock: true,
    stockCount: 20,
    tag: "Bestseller",
    description: "Adorable traditional pavada and blouse set for little girls. Perfect for Onam, weddings, and family celebrations.",
    fabricDetails: "Cotton Silk with Kasavu Border.",
    careInstructions: "Gentle machine wash in cold water.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "ke-002",
    name: "Kids Kasavu Pavada",
    category: "Kids Ethnic Wear",
    occasions: ["Onam & Vishu", "Festive"],
    price: 1800,
    images: [casual, sarees, ethnic],
    sizes: ["1-2 Yrs", "2-3 Yrs", "3-4 Yrs", "4-5 Yrs", "5-6 Yrs", "6-7 Yrs"],
    colors: [{ name: "White & Gold", hex: "#F8F5F0" }],
    inStock: true,
    stockCount: 18,
    tag: "New",
    description: "Traditional Kerala kasavu pavada for girls — white cotton with gold border. Simple, elegant, and perfect for any Kerala festive occasion.",
    fabricDetails: "Kerala Cotton, Gold Kasavu Border.",
    careInstructions: "Machine wash in cold water.",
    deliveryDays: "2–4 working days",
    isNew: true,
    isBestseller: false,
  },
  {
    id: "ke-003",
    name: "Kids Festive Churidar Set",
    category: "Kids Ethnic Wear",
    occasions: ["Festive", "Party", "Wedding"],
    price: 1500,
    images: [casual, ethnic, confidence],
    sizes: ["3-4 Yrs", "4-5 Yrs", "5-6 Yrs", "6-7 Yrs", "7-8 Yrs", "8-9 Yrs"],
    colors: [
      { name: "Peach", hex: "#FFDAB9" },
      { name: "Sky Blue", hex: "#87CEEB" },
    ],
    inStock: true,
    stockCount: 22,
    description: "Comfortable and cute churidar set for girls. Bright colour, easy to wear, and perfect for school functions, birthday parties, and festivals.",
    fabricDetails: "Cotton Blend. Set: Kurta + Churidar.",
    careInstructions: "Machine wash.",
    deliveryDays: "2–4 working days",
    isNew: false,
    isBestseller: false,
  },

  // ── BRIDAL LEHENGAS ──────────────────────────────────────────────────────────
  {
    id: "bl-001",
    name: "Maroon Zardozi Bridal Lehenga",
    category: "Bridal Lehengas",
    occasions: ["Wedding", "Bridal"],
    price: 48500,
    images: [hero, bridal, thread],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Deep Maroon", hex: "#800000" },
      { name: "Royal Red", hex: "#8B0000" },
    ],
    inStock: true,
    stockCount: 2,
    tag: "Signature",
    description: "An heirloom-quality bridal lehenga in deep maroon velvet with hand-crafted gold zardozi embroidery throughout. Includes matching blouse and heavy dupatta. Custom fitting available.",
    fabricDetails: "Premium Velvet Lehenga, Raw Silk Blouse, Net Dupatta. Zardozi & Gold Threadwork throughout.",
    careInstructions: "Dry clean only. Store in garment bag provided.",
    deliveryDays: "14–21 working days (custom stitching included)",
    isNew: false,
    isBestseller: true,
  },
  {
    id: "bl-002",
    name: "Gold Threadwork Bridal Lehenga",
    category: "Bridal Lehengas",
    occasions: ["Wedding", "Bridal"],
    price: 56800,
    images: [bridal, hero, thread],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory & Gold", hex: "#FFFFF0" },
      { name: "Champagne", hex: "#F7E7CE" },
    ],
    inStock: true,
    stockCount: 2,
    tag: "Signature",
    description: "Grand bridal lehenga layered in sheer organza with hand-painted motifs and gold threadwork. A statement piece for the modern bride who wants something truly unforgettable.",
    fabricDetails: "Organza Over Silk, Hand-Painted Motifs, Gold Threadwork, Crystal Detailing.",
    careInstructions: "Dry clean only.",
    deliveryDays: "21–28 working days (includes custom fitting)",
    isNew: false,
    isBestseller: true,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (category: Category): Product[] =>
  products.filter((p) => p.category === category);

export const getRelatedProducts = (product: Product, limit = 4): Product[] =>
  products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);

export const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
export const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
