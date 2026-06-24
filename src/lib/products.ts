import sarees from "@/assets/cat-sarees.jpg";
import ethnic from "@/assets/cat-ethnic.jpg";
import casual from "@/assets/cat-casual.jpg";
import bridal from "@/assets/cat-bridal.jpg";
import custom from "@/assets/cat-custom.jpg";
import hero from "@/assets/hero-bride.jpg";

export type Category =
  | "Sarees"
  | "Ethnic Wear"
  | "Casual Wear"
  | "Bridal Collection"
  | "Custom Stitching";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  tag?: string;
}

export const categories: { name: Category; image: string; blurb: string; slug: string }[] = [
  {
    name: "Sarees",
    image: sarees,
    blurb: "Handpicked silks, kanjivarams and contemporary drapes.",
    slug: "sarees",
  },
  {
    name: "Ethnic Wear",
    image: ethnic,
    blurb: "Anarkalis, salwars and festive ensembles.",
    slug: "ethnic-wear",
  },
  {
    name: "Casual Wear",
    image: casual,
    blurb: "Quiet luxury for the everyday woman.",
    slug: "casual-wear",
  },
  {
    name: "Bridal Collection",
    image: bridal,
    blurb: "Heirloom lehengas crafted for the once-in-a-lifetime.",
    slug: "bridal",
  },
  {
    name: "Custom Stitching",
    image: custom,
    blurb: "Bespoke tailoring measured to your every contour.",
    slug: "custom-stitching",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Maroon Zardozi Bridal Lehenga",
    category: "Bridal Collection",
    price: 48500,
    image: hero,
    tag: "Signature",
  },
  {
    id: "p2",
    name: "Emerald Kanjivaram Silk Saree",
    category: "Sarees",
    price: 18900,
    image: sarees,
    tag: "New",
  },
  {
    id: "p3",
    name: "Ivory Chikankari Anarkali",
    category: "Ethnic Wear",
    price: 12400,
    image: ethnic,
  },
  { id: "p4", name: "Linen Co-ord — Sand", category: "Casual Wear", price: 4800, image: casual },
  { id: "p5", name: "Crimson Banarasi Saree", category: "Sarees", price: 22500, image: bridal },
  { id: "p6", name: "Black Onyx Drape Saree", category: "Sarees", price: 15200, image: sarees },
  {
    id: "p7",
    name: "Gold Threadwork Lehenga",
    category: "Bridal Collection",
    price: 56800,
    image: bridal,
    tag: "Atelier",
  },
  {
    id: "p8",
    name: "Ecru Embroidered Kurta Set",
    category: "Ethnic Wear",
    price: 8900,
    image: ethnic,
  },
];

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
