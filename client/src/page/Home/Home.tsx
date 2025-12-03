import { PopularArtists } from "@/components/artist";
import { FeaturedPlaylists } from "@/components/feature";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { TrendingSongs } from "@/components/trending";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import axios from "@/axios";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios({
        method: "get",
        url: "/home",
      });
      dispatch({
        type: "fetchHome",
        payload: data.data.data.data.items,
      });
    };
    fetchData();
  }, [dispatch]);
  const data = useAppSelector((state) => state.app.homeData);
  const dataPlayList: any = data.find(
    (item: any) => (item.sectionType === "playlist" && item.title) === "Chill"
  );
  const dataSlier = data.find(
    (item: any) => item.sectionType === "new-release"
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-24">
        <HeroSection data={dataSlier} />
        <FeaturedPlaylists data={dataPlayList} />
        <PopularArtists />
        <TrendingSongs />
      </main>
      <Footer />
    </div>
  );
}
