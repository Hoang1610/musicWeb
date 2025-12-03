import { Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMusicPlayer } from "@/lib/utils";
import { useAppDispatch } from "@/store/hook";

export function HeroSection({ data }: { data: any }) {
  const dispatch = useAppDispatch();
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/20 via-background to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
              🎵 Hơn 100 triệu bài hát
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
              Âm Nhạc
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                {" "}
                Không Giới Hạn
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Khám phá thế giới âm nhạc với hàng triệu bài hát, podcast và
              playlist được tạo riêng cho bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
                onClick={() => {
                  getMusicPlayer(data.items["all"][0], dispatch);
                  dispatch({
                    type: "setDataSong",
                    payload: data.items["all"],
                  });
                }}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Nghe Ngay
              </Button>
              <button
                className="flex items-center gap-2 px-5 h-10 bg-card border border-border rounded-full font-medium text-foreground hover:bg-secondary transition-colors"
                onClick={() => {
                  getMusicPlayer(data.items["all"][0], dispatch);
                  dispatch({
                    type: "setDataSong",
                    payload: data.items["all"],
                  });
                }}
              >
                <Shuffle className="w-5 h-5" />
                <span className="hidden sm:inline">Phát ngẫu nhiên</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 mt-12">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  100M+
                </div>
                <div className="text-sm text-muted-foreground">Bài hát</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  50M+
                </div>
                <div className="text-sm text-muted-foreground">Người dùng</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">Nghệ sĩ</div>
              </div>
            </div>
          </div>

          {/* Featured Album Art */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/album-cover-modern-music-purple-aesthetic.jpg"
                  alt="Featured Album"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Floating Cards */}
            <div className="absolute -left-8 top-20 w-48 h-48 rounded-xl overflow-hidden shadow-xl -rotate-12 opacity-60">
              <img
                src="/music-album-cover-pop-artist.jpg"
                alt="Album 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -right-4 bottom-10 w-40 h-40 rounded-xl overflow-hidden shadow-xl rotate-6 opacity-60">
              <img
                src="/hip-hop-album-cover.png"
                alt="Album 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
