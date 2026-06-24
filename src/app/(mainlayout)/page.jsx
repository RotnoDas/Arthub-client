import Banner from "@/components/banner/Banner";
import ArtCategories from "@/components/art-categories/ArtCategories";
import FeaturedArtworks from "@/components/featured-artworks/FeaturedArtworks";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Banner />
      <ArtCategories />
      <FeaturedArtworks />
    </div>
  );
}
