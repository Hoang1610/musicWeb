import { Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function ArtistNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Không tìm thấy nghệ sĩ
        </h1>
        <p className="text-muted-foreground mb-6">
          Nghệ sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}
