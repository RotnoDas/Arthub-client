import Banner from "@/components/banner/Banner";
import ArtCategories from "@/components/art-categories/ArtCategories";
import FeaturedArtworks from "@/components/featured-artworks/FeaturedArtworks";
import TopArtists from "@/components/top-artists/TopArtists";
import Newsletter from "@/components/newsletter/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      <Banner />
      <ArtCategories />
      <FeaturedArtworks />
      <TopArtists />
      <Newsletter />
    </div>
  );
}
