import { useState } from "react";
import {
  ArrowLeft,
  Play,
  Shuffle,
  Heart,
  Share2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Music,
  Disc,
  Users,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { convertMinute, getMusicPlayer, shuffleArray } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { toast } from "sonner";

export function ArtistDetailClient({ artist }: any) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [songList, setSongList] = useState<any>(
    artist.sections[0].items.filter(
      (item: any) => item.previewInfo === undefined
    )
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
  const artistSimlarArr = artist.sections.find(
    (item: any) => item.sectionType === "artist"
  );
  const playListArr = artist.sections.find(
    (item: any) => item.sectionType === "playlist" && item.title === "Tuyển tập"
  );
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Cover Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.thumbnailM})` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/60 to-background" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/30 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Artist Avatar */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-primary shadow-2xl shrink-0">
              <img
                src={artist.thumbnailM || "/placeholder.svg"}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Artist Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-primary text-sm">
                  <CheckCircle className="w-4 h-4 fill-primary" />
                  Nghệ sĩ được xác minh
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
                {artist.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm md:text-base">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {artist.follow} followers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="container mx-auto px-4 md:px-12 py-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 gap-2"
            onClick={() => getMusicPlayer(songList[0], dispatch)}
          >
            <Play className="w-5 h-5 fill-current" />
            Phát nhạc
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
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
            Trộn bài
          </Button>
          <Button
            size="lg"
            variant={isFollowing ? "default" : "outline"}
            className={`rounded-full px-6 ${
              isFollowing
                ? "bg-primary"
                : "border-white/30 text-foreground hover:bg-white/10"
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bio Section */}
      {artist.biography && (
        <div className="container mx-auto px-4 md:px-12 py-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-3">
              Giới thiệu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {artist.biography}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a
                href={""}
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={""}
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={""}
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Popular Songs */}
      <div className="container mx-auto px-4 md:px-12 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            Bài hát phổ biến
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
            {playListArr.items.map((item: any) => (
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

      {/* Similar Artists */}
      {artistSimlarArr && (
        <div className="container mx-auto px-4 md:px-12 py-6 pb-32">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Nghệ sĩ tương tự
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
            {artistSimlarArr.items.map((similarArtist: any) => (
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
    </div>
  );
}
