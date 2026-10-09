export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  emoji: string;
  featured?: boolean;
  stock: number;
};

export const products: Product[] = [
  { id: "minimal-sneakers", name: "Minimal Sneakers", category: "Footwear", price: 2499, description: "Lightweight everyday sneakers with a clean silhouette and all-day comfort.", emoji: "👟", featured: true, stock: 18 },
  { id: "everyday-backpack", name: "Everyday Backpack", category: "Accessories", price: 1799, description: "A durable, roomy backpack for commutes, classes, and weekend adventures.", emoji: "🎒", featured: true, stock: 24 },
  { id: "classic-watch", name: "Classic Watch", category: "Watches", price: 3299, description: "A timeless stainless-steel watch with a comfortable, adjustable strap.", emoji: "⌚", featured: true, stock: 9 },
  { id: "wireless-headphones", name: "Wireless Headphones", category: "Electronics", price: 2999, description: "Immersive sound, clear calls, and a battery that keeps up with your day.", emoji: "🎧", featured: true, stock: 15 },
  { id: "ceramic-mug", name: "Ceramic Mug", category: "Home", price: 699, description: "A simple, sturdy mug for coffee, tea, and slow mornings.", emoji: "☕", stock: 40 },
  { id: "linen-shirt", name: "Linen Shirt", category: "Apparel", price: 1499, description: "Breathable linen with a relaxed fit for warm days.", emoji: "👕", stock: 12 },
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}
