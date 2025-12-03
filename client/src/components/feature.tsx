import { Play } from "lucide-react";
import { Link } from "react-router";

export function FeaturedPlaylists({ data }: { data: any }) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16" id="playList">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Playlist Nổi Bật
          </h2>
          <p className="text-muted-foreground mt-1">
            Được tuyển chọn dành riêng cho bạn
          </p>
        </div>
        <Link
          to={"/playlist"}
          className="text-primary hover:text-primary/80 font-medium hidden sm:block"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {data?.items &&
          data.items.map((playlist: any, index: number) => {
            if (index > 5) return;
            return (
              <Link
                to={`${playlist.link}`}
                key={playlist.id}
                className="group relative bg-card rounded-xl p-3 md:p-4 hover:bg-secondary transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-3 md:mb-4">
                  <img
                    src={playlist.thumbnail || "/placeholder.svg"}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                      <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
                  {playlist.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground truncate mt-1">
                  {playlist.sortDescription}
                </p>
              </Link>
            );
          })}
      </div>
    </section>
  );
}
