import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "@/axios";
import ArtistNotFound from "../artist/notFound";
import { SearchPageDetail } from "./search-detail";
import { Header } from "@/components/header";
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const dataApi = await axios({
        method: "get",
        url: `/searchSong?key=${key}`,
      });
      setData(dataApi.data.data.data);
    };
    fetchData();
  }, [key]);
  return (
    <>
      <Header />
      {data && <SearchPageDetail searchData={data} />}
      {!data && <ArtistNotFound />}
    </>
  );
}
