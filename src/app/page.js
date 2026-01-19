import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import { getProducts } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();

  // Take only first 8 products for featured section
  const featuredProducts = products.slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <FeaturedProducts initialProducts={featuredProducts} />
      <Footer />
    </main>
  );
}
