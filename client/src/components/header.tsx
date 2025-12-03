import { useState } from "react";
import { Menu, X, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    navigate(`/search?key=${e.target[0].value}`);
  };
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={""} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                S
              </span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground">
              Sound<span className="text-primary">Wave</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Khám Phá
            </a>
            <a
              href="#artist"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Nghệ Sĩ
            </a>
            <a
              href="#playList"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Playlist
            </a>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form className="relative w-full" onSubmit={handleSubmit}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                className="w-full pl-10 bg-secondary border-none focus-visible:ring-primary"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground md:hidden"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground">
              <User className="w-4 h-4 mr-2" />
              Đăng Nhập
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4">
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Khám Phá
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Thể Loại
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Nghệ Sĩ
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Playlist
              </a>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                <User className="w-4 h-4 mr-2" />
                Đăng Nhập
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
