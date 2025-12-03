import { RouterProvider } from "react-router";
import router from "./route";
import { MusicPlayer } from "./components/music-player";
import { useAppSelector } from "./store/hook";
import { Toaster } from "sonner";
import { Chatbot } from "./components/chatbot";

function App() {
  const { currentSong, dataSong } = useAppSelector((state) => state.app);
  return (
    <>
      <Toaster richColors position="top-center" />
      <RouterProvider router={router} />
      <MusicPlayer songId={currentSong} dataSong={dataSong} />
      <Chatbot />
    </>
  );
}

export default App;
