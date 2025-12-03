import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  Shuffle,
  Download,
  ListMusic,
  Users,
  Music2,
} from "lucide-react";
import { Link, useParams } from "react-router";
import axios from "@/axios";
import {
  capitalizeFirstLetter,
  convertHour,
  convertMinute,
  getMusicPlayer,
  shuffleArray,
} from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { toast } from "sonner";

export default function PlaylistDetailClient() {
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [playlist, setPlayList] = useState<any>(null);
  const [isLikedPlaylist, setIsLikedPlaylist] = useState(false);
  const { currentSong, isPlay } = useAppSelector((state) => state.app);
  const [songList, setSongList] = useState<any>(null);
  let { id } = useParams();
  id = id?.slice(0, -5);
  const dispatch = useAppDispatch();
  const toggleLikeSong = (songId: number) => {
    setLikedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };
  useEffect(() => {
    const fetchData = async () => {
      const dataApi = await axios({
        method: "get",
        url: `/detailPlayList?id=${id}`,
      });
      dispatch({
        type: "setDataSong",
        payload: dataApi.data.data.data.song.items.filter(
          (item: any) => item.previewInfo === undefined
        ),
      });
      setPlayList(dataApi.data.data.data);
      setSongList(
        dataApi.data.data.data.song.items.filter(
          (item: any) => item.previewInfo === undefined
        )
      );
    };
    fetchData();
  }, [id, dispatch]);

  return (
    <>
      {playlist && (
        <div className="min-h-screen bg-background pb-24">
          {/* Header with gradient background */}
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 max-h-[400px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${playlist.thumbnailM})` }}
              />
              <div className="absolute inset-0 bg-linear-to-b from-primary/60 via-primary/40 to-background" />
              <div className="absolute inset-0 bg-linear-to-b from-background/50 to-transparent" />
            </div>

            {/* Navigation */}
            <header className="sticky z-10 top-0 bg-transparent">
              <div className="container mx-auto px-4 py-4">
                <Link
                  to="/playlist"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full px-4 py-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Quay lại</span>
                </Link>
              </div>
            </header>

            {/* Playlist Info */}
            <div className="relative z-10 container mx-auto px-4 pt-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end">
                {/* Playlist Cover */}
                <div className="relative group">
                  <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                    <img
                      src={playlist.thumbnail || "/placeholder.svg"}
                      alt={capitalizeFirstLetter(playlist.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <button
                    // onClick={handlePlayAll}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                    </div>
                  </button>
                </div>

                {/* Playlist Details */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-3">
                    PlayList
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-balance">
                    {capitalizeFirstLetter(playlist.title)}
                  </h1>
                  <p className="text-white/80 text-base md:text-lg max-w-2xl mb-4">
                    {playlist.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Music2 className="w-4 h-4" />
                      {songList?.length} bài hát
                    </span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {convertHour(playlist.boolAtt)}
                    </span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {formatFollowers(playlist.like)} người theo dõi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button
                onClick={() => getMusicPlayer(songList[0], dispatch)}
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                Phát tất cả
              </button>

              <button
                className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-full font-medium text-foreground hover:bg-secondary transition-colors"
                onClick={() => {
                  const newArr = shuffleArray(songList);
                  dispatch({
                    type: "setDataSong",
                    payload: newArr,
                  });
                  setSongList(newArr);
                  toast.success("Đã phát ngẫu nhiên");
                  getMusicPlayer(newArr[0], dispatch);
                }}
              >
                <Shuffle className="w-5 h-5" />
                <span className="hidden sm:inline">Trộn bài</span>
              </button>

              <button
                onClick={() => setIsLikedPlaylist(!isLikedPlaylist)}
                className={`p-3 rounded-full border transition-all ${
                  isLikedPlaylist
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isLikedPlaylist ? "fill-current" : ""}`}
                />
              </button>

              <button className="p-3 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                <Download className="w-5 h-5" />
              </button>

              <button className="p-3 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                <Share2 className="w-5 h-5" />
              </button>

              <button className="p-3 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all ml-auto">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Songs List */}
          {songList && (
            <div className="container mx-auto px-4">
              <div className="hidden md:grid grid-cols-[40px_1fr_1fr_100px_80px] gap-4 px-4 py-3 text-sm text-muted-foreground border-b border-border mb-2">
                <span className="text-center">#</span>
                <span>Tiêu đề</span>
                <span>Album</span>
                <span className="text-right">
                  <Clock className="w-4 h-4 inline" />
                </span>
              </div>
              <div className="space-y-1">
                {songList.map((song: any, index: number) => (
                  <div
                    key={song.encodeId}
                    className={`group grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_1fr_100px_80px] gap-4 items-center px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      currentSong === song.encodeId
                        ? "bg-primary/20 border border-primary/30"
                        : "hover:bg-card border border-transparent"
                    }`}
                    onClick={() => getMusicPlayer(song, dispatch)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`text-sm ${
                          currentSong === song.encodeId
                            ? "text-primary font-semibold"
                            : "text-muted-foreground"
                        } group-hover:hidden`}
                      >
                        {index + 1}
                      </span>
                      <button className="hidden group-hover:flex items-center justify-center">
                        {currentSong === song.encodeId && isPlay ? (
                          <Pause className="w-4 h-4 text-primary fill-current" />
                        ) : (
                          <Play className="w-4 h-4 text-primary fill-current" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                        <img
                          src={song.thumbnail || "/placeholder.svg"}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        {currentSong === song.encodeId && isPlay && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex items-end gap-0.5 h-4">
                              <span
                                className="w-1 bg-primary animate-pulse rounded-full"
                                style={{ height: "60%" }}
                              />
                              <span
                                className="w-1 bg-primary animate-pulse rounded-full"
                                style={{
                                  height: "100%",
                                  animationDelay: "0.2s",
                                }}
                              />
                              <span
                                className="w-1 bg-primary animate-pulse rounded-full"
                                style={{
                                  height: "40%",
                                  animationDelay: "0.4s",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`font-medium truncate ${
                            currentSong === song.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {song.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.artistsNames}
                        </p>
                      </div>
                    </div>

                    <span className="hidden md:block text-sm text-muted-foreground truncate">
                      {song?.album?.title}
                    </span>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(song.encodeId);
                        }}
                        className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                          likedSongs.includes(song.encodeId)
                            ? "text-primary opacity-100"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedSongs.includes(song.encodeId)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </button>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {convertMinute(song.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Playlists Suggestion */}
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-6">
              <ListMusic className="w-6 h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Có thể bạn cũng thích
              </h2>
            </div>
            <p className="text-muted-foreground">
              Khám phá thêm các playlist cùng thể loại {playlist.category}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
