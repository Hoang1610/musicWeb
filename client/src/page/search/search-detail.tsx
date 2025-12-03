import { useState } from "react";
import { Play, Heart, Clock, Music, Disc, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { convertMinute, getMusicPlayer } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hook";

export function SearchPageDetail({ searchData }: any) {
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const songList = searchData.songs.filter(
    (item: any) => item.previewInfo === undefined
  );
  const { currentSong } = useAppSelector((state) => state.app);
  const toggleLike = (songId: number) => {
    setLikedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };
  const dispatch = useAppDispatch();
  const artistArr = searchData.artists;
  const playListArr = searchData.playlists;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-12 py-6">
        <h1 className="text-2xl font-bold text-foreground">Kết quả tìm kiếm</h1>
      </div>
      {/* Similar Artists */}
      {artistArr && (
        <div className="container mx-auto px-4 md:px-12 py-6 pb-32">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Nghệ sĩ
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
            {artistArr.map((similarArtist: any) => (
              <Link
                key={similarArtist.id}
                to={similarArtist.link}
                className="group text-center"
              >
                <div className="relative mb-3">
                  <div className="w-full aspect-square rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-lg">
                    <img
                      src={similarArtist.thumbnailM || "/placeholder.svg"}
                      alt={similarArtist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-linear-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base truncate group-hover:text-primary transition-colors">
                  {similarArtist.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Popular Songs */}
      <div className="container mx-auto px-4 md:px-12 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            Bài hát
          </h2>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50">
          {songList.map((song: any, index: any) => (
            <div
              key={song.encodeId}
              className={`flex items-center justify-between gap-4 p-4 hover:bg-primary/10 transition-colors cursor-pointer group ${
                currentSong === song.encodeId ? "bg-primary/20" : ""
              }`}
              onClick={() => getMusicPlayer(song, dispatch)}
            >
              {/* Index/Play Button */}
              <div className="w-8 text-center">
                {currentSong === song.encodeId ? (
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                    <span className="w-1 h-3 bg-primary rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-5 bg-primary rounded-full animate-pulse delay-150" />
                  </div>
                ) : (
                  <>
                    <span className="text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-primary hidden group-hover:block mx-auto" />
                  </>
                )}
              </div>

              {/* Song Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img
                  src={song.thumbnail || "/placeholder.svg"}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium truncate ${
                    currentSong === song.encodeId
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {song.title}
                </h3>
                {song.album?.title}
                <p className="text-sm text-muted-foreground truncate"></p>
              </div>
              <span className="hidden md:block text-sm text-muted-foreground truncate">
                {song.artistsNames}
              </span>
              {/* Like Button */}
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(song.encodeId);
                }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedSongs.includes(song.encodeId)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>

              {/* Duration */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground w-16 justify-end">
                <Clock className="w-3 h-3" />
                {convertMinute(song.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Albums */}
      {playListArr && (
        <div className="container mx-auto px-4 md:px-12 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Disc className="w-6 h-6 text-primary" />
              Album
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {playListArr.map((item: any) => (
              <Link
                to={item.link}
                key={item.encodeId}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      className="bg-primary hover:bg-primary/90 rounded-full w-12 h-12"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.artistsNames}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
