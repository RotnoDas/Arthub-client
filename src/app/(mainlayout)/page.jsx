import Banner from "@/components/banner/Banner";
import FeaturedArtworks from "@/components/featured-artworks/FeaturedArtworks";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Banner />
      <FeaturedArtworks />
    </div>
  );
}
