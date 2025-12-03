import { createBrowserRouter } from "react-router";
import Home from "./page/Home/Home";
import AllPlaylistsPage from "./page/playlist";
import PlaylistDetailClient from "./page/playlistDetail";
import ArtistDetailPage from "./page/artist";
import AllReleasePage from "./page/slider";
import SearchPage from "./page/search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/playlist",
    element: <AllPlaylistsPage />,
  },
  {
    path: "/album/:title/:id",
    element: <PlaylistDetailClient />,
  },
  {
    path: "/:name",
    element: <ArtistDetailPage />,
  },
  {
    path: "/release",
    element: <AllReleasePage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
]);
export default router;
