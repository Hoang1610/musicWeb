import { Link } from "react-router";

const artists = [
  {
    id: 1,
    name: "Sơn Tùng M-TP",
    followers: "2.6M",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/5/9/6/9/59696c9dba7a914d587d886049c10df6.jpg",
    link: "/Son-Tung-M-TP",
  },
  {
    id: 2,
    name: "MONO",
    followers: "50k",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/7/f/8/5/7f859c6fa608312f87a9a71cc4388a10.jpg",
    link: "/MONO",
  },
  {
    id: 3,
    name: "HIEUTHUHAI",
    followers: "178k",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/e/c/6/c/ec6cb19cfded44f239c48132ba77082f.jpg",
    link: "/HIEUTHUHAI",
  },
  {
    id: 4,
    name: "Đen Vâu",
    followers: "564k",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/0/9/e/c/09ec67133c4ff1e7c49e79aea4980ede.jpg",
    link: "/Den",
  },
  {
    id: 5,
    name: "Bích Phương",
    followers: "446k",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/9/a/8/a/9a8a68d403d3402c4f9976c65c2db3b2.jpg",
    link: "/Bich-Phuong",
  },
  {
    id: 6,
    name: "Jack",
    followers: "2.5M",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/7/8/2/e/782e2de707d0db21e29a0340d5061f0b.jpg",
    link: "/Jack-J97",
  },
  {
    id: 7,
    name: "Karik",
    followers: "537k",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/f/4/3/6/f4363d089453918c8aa9b7ad5b38cdbc.jpg",
    link: "/Karik",
  },
  {
    id: 8,
    name: "Mỹ Tâm",
    followers: "318k",
    image:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/avatars/9/7/1/f/971f3867f18de17fcdf6be2a3abe68f7.jpg",
    link: "/My-Tam",
  },
];

export function PopularArtists() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16" id="artist">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Nghệ Sĩ Phổ Biến
          </h2>
          <p className="text-muted-foreground mt-1">
            Những nghệ sĩ được yêu thích nhất
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
        {artists.map((artist) => (
          <Link
            to={artist.link}
            key={artist.id}
            className="group text-center cursor-pointer"
          >
            <div className="relative mb-3 md:mb-4">
              <div className="w-full aspect-square rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all duration-300">
                <img
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-linear-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
              {artist.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {artist.followers} followers
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
