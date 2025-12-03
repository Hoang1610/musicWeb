import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Play,
  Search,
  Filter,
  Grid3X3,
  List,
  Music2,
} from "lucide-react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import axios from "@/axios";
import { getMusicPlayer } from "@/lib/utils";
export default function AllReleasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const data: any = useAppSelector((state) => state.app.homeData);
  const dispatch = useAppDispatch();
  const dataSlier = data.find(
    (item: any) => item.sectionType === "new-release"
  );
  let categories = ["vPop", "others"];
  categories?.unshift("Tất cả");
  const uniqueset = new Set(categories);
  categories = [...uniqueset];
  if (dataSlier) {
    dataSlier.items["all"] = [];
    dataSlier?.items["vPop"].forEach((item: any) => {
      if (!item.previewInfo) {
        dataSlier.items["all"].push({
          ...item,
          category: "vPop",
        });
      }
    });
    dataSlier.items["others"].forEach((item: any) => {
      if (!item.previewInfo) {
        dataSlier.items["all"].push({
          ...item,
          category: "others",
        });
      }
    });
  }
  console.log(searchTerm);
  const filteredPlaylists = dataSlier?.items["all"].filter((playlist: any) => {
    const matchesSearch = playlist.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || playlist.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  useEffect(() => {
    if (data.length === 0) {
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
    }
  }, [data, dispatch]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm bài hát..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Thể loại</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories &&
              categories.map((category: any) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Hiển thị{" "}
          <span className="text-primary font-semibold">
            {filteredPlaylists && filteredPlaylists.length}
          </span>{" "}
          playlist
        </p>

        {/* Playlists Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredPlaylists &&
              filteredPlaylists.map((playlist: any) => (
                <div
                  onClick={() => {
                    getMusicPlayer(playlist, dispatch);
                    dispatch({
                      type: "setDataSong",
                      payload: dataSlier.items["all"],
                    });
                  }}
                  key={playlist.id}
                  className="overflow-hidden group relative bg-card rounded-xl p-3 md:p-4 hover:bg-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/30"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3 md:mb-4">
                    <img
                      src={playlist.thumbnailM || "/placeholder.svg"}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110">
                        <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                      </button>
                    </div>
                    <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white">
                      {playlist.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
                    {playlist.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground truncate mt-1">
                    {playlist.description}
                  </p>
                  <span className="text-xs text-primary mt-2 block font-medium ">
                    {playlist.artists.map((item: any) => item.name).join(", ")}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlaylists &&
              filteredPlaylists.map((playlist: any, index: number) => (
                <Link
                  to={`${playlist.link}`}
                  key={playlist.id}
                  className="group flex items-center gap-4 bg-card rounded-xl p-3 md:p-4 hover:bg-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/30"
                >
                  <span className="w-8 text-center text-muted-foreground font-medium">
                    {index + 1}
                  </span>
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={playlist.thumbnail || "/placeholder.svg"}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {playlist.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {playlist.sortDescription}
                    </p>
                  </div>
                  <span className="hidden sm:block px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                    {playlist.category}
                  </span>
                  <span className="text-sm text-primary font-medium whitespace-nowrap w-[30%] overflow-hidden">
                    {playlist.artists.map((item: any) => item.name).join(", ")}
                  </span>
                  <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg shadow-primary/30">
                    <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
                  </button>
                </Link>
              ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPlaylists && filteredPlaylists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Music2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Không tìm thấy playlist
            </h3>
            <p className="text-muted-foreground max-w-md">
              Thử tìm kiếm với từ khóa khác hoặc chọn thể loại khác
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tất cả");
              }}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
