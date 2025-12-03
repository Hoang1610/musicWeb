import { Play, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { convertMinute, getMusicPlayer } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router";
export function TrendingSongs() {
  const dispatch = useAppDispatch();
  const { homeData } = useAppSelector((state) => state.app);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const toggleLikeSong = (songId: number) => {
    setLikedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };
  const dataSlier = homeData.find(
    (item: any) => item.sectionType === "new-release"
  );
  return (
    <>
      {dataSlier && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Bài Hát Thịnh Hành
              </h2>
              <p className="text-muted-foreground mt-1">
                Đang được nghe nhiều nhất
              </p>
            </div>
            <Link
              to="/release"
              className="text-primary hover:text-primary/80 font-medium hidden sm:block"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="bg-card rounded-2xl overflow-hidden">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-[40px_1fr_1fr_100px_80px_100px] gap-4 px-6 py-4 border-b border-border text-sm text-muted-foreground">
              <span>#</span>
              <span>Bài hát</span>
              <span></span>
              <span className="text-right">Thời lượng</span>
            </div>

            {/* Songs List */}
            <div className="divide-y divide-border/50">
              {dataSlier.items["all"].map((song: any, index: any) => (
                <div
                  onClick={() => {
                    getMusicPlayer(song, dispatch);
                    dispatch({
                      type: "setDataSong",
                      payload: dataSlier.items["all"],
                    });
                  }}
                  key={song.encodeId}
                  className="group grid md:grid-cols-[40px_1fr_1fr_100px_80px_100px] gap-4 px-4 md:px-6 py-3 md:py-4 hover:bg-secondary/50 transition-colors items-center cursor-pointer"
                >
                  {/* Index / Play Button */}
                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-foreground hidden group-hover:block fill-current" />
                  </div>

                  {/* Song Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={song.thumbnail || "/placeholder.svg"}
                        alt={song.title}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center md:hidden">
                        <Play className="w-5 h-5 text-white fill-current" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground truncate text-sm md:text-base">
                        {song.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {song.artistsNames}
                      </p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 md:gap-2">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Duration - Desktop */}
                  <div className="hidden md:block text-right">
                    <span className="text-sm text-muted-foreground">
                      {convertMinute(song.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
