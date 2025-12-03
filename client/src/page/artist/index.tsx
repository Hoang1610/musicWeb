import { useParams } from "react-router";
import { ArtistDetailClient } from "./artist-detail";
import { useEffect, useState } from "react";
import axios from "@/axios";
import ArtistNotFound from "./notFound";
import { useAppDispatch } from "@/store/hook";
export default function ArtistDetailPage() {
  const params = useParams();
  const artistName = params.name;
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const dataApi = await axios({
        method: "get",
        url: `/artist?name=${artistName}`,
      });
      if ((dataApi as any).msg) return;
      setData(dataApi.data.data.data);
      dispatch({
        type: "setDataSong",
        payload: dataApi.data.data.data.sections[0].items.filter(
          (item: any) => item.previewInfo === undefined
        ),
      });
    };
    fetchData();
  }, [artistName, dispatch]);
  return (
    <>
      {data && <ArtistDetailClient artist={data} />}
      {!data && <ArtistNotFound />}
    </>
  );
}
