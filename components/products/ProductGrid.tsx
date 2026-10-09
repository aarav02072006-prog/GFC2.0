import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  variant = "grid",
}: {
  products: Product[];
  variant?: "grid" | "list" | "search" | "compact";
}) {
  if (variant === "list") {
    return (
      <div className="grid gap-3 sm:gap-4">
        {products.map((product) => <ProductCard key={product.id} product={product} variant="list" />)}
      </div>
    );
  }

  if (variant === "search") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} variant="search" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} variant={variant} />)}
    </div>
  );
}
