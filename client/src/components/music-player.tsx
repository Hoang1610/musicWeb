/* eslint-disable react-hooks/refs */
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Maximize2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import axios from "@/axios";
import karaokeScript from "@/lib/karaokeScript";
import { convertMinute, getMusicPlayer, shuffleArray } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  type CarouselApi,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { ButtonSelect } from "./buttonSelect";
import { toast } from "sonner";
export function MusicPlayer({
  songId,
  dataSong,
}: {
  songId: string;
  dataSong: any;
}) {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [link, setLink] = useState(null);
  const [api, setApi] = useState<CarouselApi>();
  const { nextSong } = useAppSelector((state) => state.app);
  const [nextSongInfo, setNextSongInfo] = useState<any>(null);
  const { isLoop, isPlay } = useAppSelector((state) => state.app);
  const [dataLyric, setDataLyric] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(1);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loopBtn = useRef<HTMLButtonElement | null>(null);
  const durationRef = useRef<HTMLSpanElement | null>(null);
  const activeSongRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLSpanElement | null>(null);
  const indexSong = dataSong?.findIndex(
    (item: any) => item.encodeId === songId
  );
  const { index } = useAppSelector((state) => state.app);
  useEffect(() => {
    if (audioRef.current && nextSongInfo !== null) {
      function setAudio() {
        if (index < (nextSongInfo as any).length) {
          dispatch({
            type: "setCurrentSong",
            payload:
              indexSong !== -1
                ? dataSong[indexSong + 1].encodeId
                : (nextSongInfo as any)[index].encodeId,
          });
          dispatch({
            type: "setIndexSong",
            payload: indexSong !== -1 ? index : index + 1,
          });
          dispatch({
            type: "setIsPlay",
            payload: true,
          });
        } else {
          dispatch({
            type: "setIndexSong",
            payload: 0,
          });
          dispatch({
            type: "setCurrentSong",
            payload: (nextSongInfo as any)[0].encodeId,
          });
        }
      }
      if (!isLoop) {
        (audioRef.current as any).addEventListener("ended", setAudio);
        return () => {
          try {
            (audioRef.current as any).removeEventListener("ended", setAudio);
          } catch (error) {
            console.log(error);
          }
        };
      } else if (isLoop) {
        function setReplay() {
          if (audioRef.current) {
            const audio: any = audioRef.current;
            audio.currentTime = 0;
            audio.play();
          }
        }
        function setAudioLoop() {
          const audio = audioRef?.current;
          if (audioRef.current) {
            (audio as any).addEventListener("ended", setReplay);
          }
          return () => {
            try {
              (audio as any).removeEventListener("ended", setReplay);
            } catch (error) {
              console.log(error);
            }
          };
        }
        const cleanUp = setAudioLoop();
        return () => {
          cleanUp();
        };
      }
    }
  }, [
    currentSong,
    isLoop,
    dispatch,
    index,
    nextSongInfo,
    dataSong,
    songId,
    indexSong,
  ]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios({
        method: "get",
        url: `/songInfo?id=${songId}`,
      });
      const link = await axios({
        method: "get",
        url: `/song?id=${songId}`,
      });
      const dataNextSong = await axios({
        method: "get",
        url: `/listSongArtist?id=${nextSong}`,
      });
      if (data.data.data.data && link.data.data.data) {
        setCurrentSong(data.data.data.data);
        setLink(link.data.data.data["128"]);
      }
      if (dataNextSong.data.data.data?.items) {
        const dataCheck = dataNextSong.data.data.data.items.filter(
          (item: any) => item.encodeId !== songId && !item.previewInfo
        );
        setNextSongInfo(dataCheck);
      }
    };
    fetchData();
  }, [songId, nextSong]);
  function hanldeChangeSlider(newValue: number[]) {
    const audio = audioRef.current;
    if (audio) {
      setProgress(newValue);
      audio.currentTime = (newValue[0] / 100) * audio.duration;
    }
  }
  function handleVolumeChange(newValue: number[]) {
    setVolume(newValue);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newValue[0] / 100;
      if (newValue[0] === 0) {
        setIsMuted(true);
      } else if (isMuted) setIsMuted(false);
    }
  }
  useEffect(() => {
    if (currentSong) {
      const audio = audioRef.current;
      const duration = durationRef.current;
      const current = currentRef.current;
      function audioTimeUpdate() {
        if (current && audio) {
          current.innerText = convertMinute(audio.currentTime);
          const value = (audio.currentTime / audio.duration) * 100;
          setProgress([value]);
        }
      }
      function playAudio() {
        if (audio && duration && current) {
          duration.innerText = convertMinute(audio.duration);
          audio.play();
          audio.addEventListener("timeupdate", audioTimeUpdate);
        }
      }
      if (audio && duration && current) {
        audio.addEventListener("loadeddata", playAudio);
        return () => {
          audio.removeEventListener("loadeddata", playAudio);
          audio.removeEventListener("timeupdate", audioTimeUpdate);
        };
      }
    }
  }, [currentSong, dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      if (currentSong) {
        const dataApi = await axios({
          method: "get",
          url: `/lyric?idSong=${(currentSong as any).encodeId}`,
        });
        if (dataApi.data.data.data.sentences) {
          setDataLyric(dataApi.data.data.data.sentences);
        } else {
          setDataLyric(null);
        }
      }
    };
    fetchData();
  }, [currentSong]);
  useEffect(() => {
    if (dataLyric) {
      const cleanUp = karaokeScript(
        dataLyric,
        (currentSong as any).title,
        (currentSong as any).artists.map((item: any) => item.name).join(", ")
      );
      return () => {
        try {
          cleanUp();
        } catch (error) {
          console.log(error);
        }
      };
    } else {
      const karaoke = document.querySelector(".karaoke-content");
      if (karaoke) {
        karaoke.innerHTML = `<p>Karaoke đang cập nhật</p>`;
      }
    }
  }, [dataLyric, currentSong]);
  useEffect(() => {
    if (api && activeTab === 0 && indexSong !== -1) {
      setTimeout(() => {
        api.scrollTo(indexSong, true);
      }, 100);
    }
  }, [api, activeTab, indexSong]);
  return (
    <>
      {/* Desktop Player */}
      {currentSong && link && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 hidden md:block">
          <audio ref={audioRef} src={link} id="audio"></audio>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20 gap-4">
              {/* Current Song Info */}
              <div className="flex items-center gap-4 w-1/4 min-w-0">
                <img
                  src={currentSong.thumbnailM}
                  alt="Now Playing"
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {currentSong.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentSong.artists &&
                      currentSong.artists
                        .map((item: any) => item.name)
                        .join(", ")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`shrink-0 ${
                    isLiked ? "text-accent" : "text-muted-foreground"
                  } hover:text-accent`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`text-muted-foreground hover:text-foreground`}
                        onClick={() => {
                          dispatch({
                            type: "setDataSong",
                            payload: shuffleArray(dataSong),
                          });
                          toast.success("Đã phát ngẫu nhiên");
                        }}
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Phát ngẫu nhiên</p>
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-foreground hover:text-primary ${
                      indexSong === -1 && index === 0 && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (index > 0) {
                        dispatch({
                          type: "setCurrentSong",
                          payload:
                            indexSong !== -1
                              ? dataSong[indexSong - 1].encodeId
                              : (nextSongInfo as any)[index].encodeId,
                        });
                        dispatch({
                          type: "setIndexSong",
                          payload: indexSong !== -1 ? index : index - 1,
                        });
                        dispatch({
                          type: "setIsPlay",
                          payload: true,
                        });
                        dispatch({
                          type: "setIsLoop",
                          payload: false,
                        });
                      }
                    }}
                  >
                    <SkipBack className={`w-5 h-5 fill-current`} />
                  </Button>
                  <Button
                    size="icon"
                    className="w-10 h-10 bg-foreground hover:bg-foreground/90 text-background rounded-full"
                    onClick={() => {
                      dispatch({
                        type: "setIsPlay",
                        payload: !isPlay,
                      });
                      const audio = audioRef.current;
                      if (audio) {
                        if (audio.paused) {
                          audio.play();
                        } else {
                          audio.pause();
                        }
                      }
                    }}
                  >
                    {isPlay ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-foreground hover:text-primary`}
                    onClick={() => {
                      if (index < nextSongInfo.length) {
                        dispatch({
                          type: "setCurrentSong",
                          payload:
                            indexSong !== -1
                              ? dataSong[indexSong + 1].encodeId
                              : (nextSongInfo as any)[index].encodeId,
                        });
                        dispatch({
                          type: "setIndexSong",
                          payload: indexSong !== -1 ? index : index + 1,
                        });
                        dispatch({
                          type: "setIsPlay",
                          payload: true,
                        });
                        dispatch({
                          type: "setIsLoop",
                          payload: false,
                        });
                      }
                    }}
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`text-muted-foreground hover:text-foreground ${
                          isLoop ? "bg-accent text-accent-foreground" : ""
                        }`}
                        ref={loopBtn}
                        onClick={() => {
                          dispatch({
                            type: "setIsLoop",
                            payload: !isLoop,
                          });
                        }}
                      >
                        <Repeat className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bật phát lại</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <span
                    className="text-xs text-muted-foreground w-10 text-right"
                    ref={currentRef}
                  >
                    0:00
                  </span>
                  <Slider
                    value={progress}
                    onValueChange={hanldeChangeSlider}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span
                    className="text-xs text-muted-foreground w-10"
                    ref={durationRef}
                  >
                    4:05
                  </span>
                </div>
              </div>

              {/* Volume & Extra Controls */}
              <div className="flex items-center gap-3 w-1/4 justify-end">
                <Sheet
                  onOpenChange={(isOpen) => {
                    if (isOpen) {
                      setTimeout(() => {
                        activeSongRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }, 100);
                    }
                  }}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ListMusic className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Danh sách phát</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-1 h-full overflow-y-auto">
                      {dataSong.map((song: any) => (
                        <div
                          key={song.encodeId}
                          ref={songId === song.encodeId ? activeSongRef : null}
                          className={`group grid grid-cols-2 gap-4 items-center px-4 py-3 rounded-lg transition-all cursor-pointer ${
                            songId === song.encodeId
                              ? "bg-primary/20 border border-primary/30"
                              : "hover:bg-card border border-transparent"
                          }`}
                          onClick={() => getMusicPlayer(song, dispatch)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                              <img
                                src={song.thumbnail || "/placeholder.svg"}
                                alt={song.title}
                                className="w-full h-full object-cover"
                              />
                              {songId === song.encodeId && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="flex items-end gap-0.5 h-4">
                                    <span
                                      className="w-1 bg-primary animate-pulse rounded-full"
                                      style={{ height: "60%" }}
                                    />
                                    <span
                                      className="w-1 bg-primary animate-pulse rounded-full"
                                      style={{
                                        height: "100%",
                                        animationDelay: "0.2s",
                                      }}
                                    />
                                    <span
                                      className="w-1 bg-primary animate-pulse rounded-full"
                                      style={{
                                        height: "40%",
                                        animationDelay: "0.4s",
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4
                                className={`font-medium truncate ${
                                  songId === song.id
                                    ? "text-primary"
                                    : "text-foreground"
                                }`}
                              >
                                {song.title}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {song.artistsNames}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // toggleLikeSong(song.encodeId);
                              }}
                              // className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                              //   likedSongs.includes(song.encodeId)
                              //     ? "text-primary opacity-100"
                              //     : "text-muted-foreground hover:text-foreground"
                              // }`}
                              className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100`}
                            >
                              <Heart
                              // className={`w-4 h-4 ${
                              //   likedSongs.includes(song.encodeId)
                              //     ? "fill-current"
                              //     : ""
                              // }`}
                              />
                            </button>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {convertMinute(song.duration)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      handleVolumeChange(isMuted ? [100] : [0]);
                      setIsMuted(!isMuted);
                    }}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                  <Slider
                    value={isMuted ? [0] : volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="top"
                    className="h-screen max-h-none w-screen rounded-none flex flex-col p-0 color-bg-linear"
                  >
                    {/* Header cố định */}
                    <SheetHeader className="p-4 relative">
                      <div className="flex justify-center items-center">
                        <ButtonSelect
                          selected={activeTab}
                          onSelect={setActiveTab}
                        />
                      </div>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-[#e9e9e9fc] rounded-full w-10 h-10 mt-1.5"
                        >
                          <ChevronDown
                            className="w-8 h-8 font-medium"
                            strokeWidth={2.5}
                          />
                        </Button>
                      </SheetClose>
                    </SheetHeader>
                    {activeTab === 0 && (
                      <div className="w-[80%] relative mx-auto ">
                        <Carousel
                          setApi={setApi}
                          className="w-full"
                          opts={{ align: "start" }}
                        >
                          <CarouselContent className="w-full">
                            {dataSong.map((song: any) => (
                              <CarouselItem
                                key={song.encodeId}
                                className={`sm:basis-1/2 lg:basis-1/3`}
                              >
                                <div className="rounded-lg transition-all cursor-pointer bg-primary/20 border border-primary/30">
                                  <Card className="bg-transparent border-transparent">
                                    <CardContent className="flex aspect-square items-center justify-center">
                                      <div className="flex flex-col items-center gap-2 w-full h-full">
                                        <div className="relative w-full h-full group">
                                          <img
                                            src={song.thumbnailM}
                                            alt={song.title}
                                            className="w-full h-full object-cover rounded-sm"
                                          />
                                          {songId === song.encodeId && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-sm">
                                              <div className="flex items-end gap-1 h-8">
                                                <span
                                                  className="w-1.5 bg-primary animate-pulse rounded-full"
                                                  style={{
                                                    height: "60%",
                                                    animationDelay: "0.1s",
                                                  }}
                                                />
                                                <span
                                                  className="w-1.5 bg-primary animate-pulse rounded-full"
                                                  style={{ height: "100%" }}
                                                />
                                                <span
                                                  className="w-1.5 bg-primary animate-pulse rounded-full"
                                                  style={{
                                                    height: "40%",
                                                    animationDelay: "0.2s",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                          {songId !== song.encodeId && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button
                                                size="icon"
                                                className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                                                onClick={() =>
                                                  getMusicPlayer(song, dispatch)
                                                }
                                              >
                                                <Play className="w-6 h-6 fill-current ml-1" />
                                              </Button>
                                            </div>
                                          )}
                                          {songId === song.encodeId && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Button
                                                size="icon"
                                                className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                                                onClick={() => {
                                                  dispatch({
                                                    type: "setIsPlay",
                                                    payload: !isPlay,
                                                  });
                                                  const audio =
                                                    audioRef.current;
                                                  if (audio) {
                                                    if (audio.paused) {
                                                      audio.play();
                                                    } else {
                                                      audio.pause();
                                                    }
                                                  }
                                                }}
                                              >
                                                {isPlay ? (
                                                  <Pause className="w-6 h-6 fill-current" />
                                                ) : (
                                                  <Play className="w-6 h-6 fill-current ml-1" />
                                                )}
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                        <p
                                          className={`font-medium truncate ${
                                            songId === song.id
                                              ? "text-primary"
                                              : "text-foreground"
                                          }`}
                                        >
                                          {song.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                          {song.artistsNames}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    )}
                    {activeTab === 1 && (
                      <>
                        <div className="karaoke h-screen flex justify-center items-center text-4xl font-mono">
                          <div className="karaoke-content flex flex-col gap-10 pb-10">
                            {!dataLyric && <p>karaoke đang cập nhật</p>}
                            {dataLyric && (
                              <>
                                <p>{currentSong?.title}</p>
                                <p>
                                  {currentSong?.artists
                                    .map((item: any) => item.name)
                                    .join(", ")}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <SheetFooter className="bg-transparent backdrop-blur-sm p-4 border-t border-border/20">
                          <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between gap-4">
                              {/* Current Song Info */}
                              <div className="flex items-center gap-4 w-1/4 min-w-0">
                                <img
                                  src={currentSong.thumbnailM}
                                  alt="Now Playing"
                                  className="w-14 h-14 rounded-lg object-cover"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-medium text-foreground truncate">
                                    {currentSong.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {currentSong.artists &&
                                      currentSong.artists
                                        .map((item: any) => item.name)
                                        .join(", ")}
                                  </p>
                                </div>
                              </div>

                              {/* Player Controls */}
                              <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                                <div className="flex items-center gap-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`text-muted-foreground hover:text-foreground`}
                                    onClick={() => {
                                      dispatch({
                                        type: "setDataSong",
                                        payload: shuffleArray(dataSong),
                                      });
                                      toast.success("Đã phát ngẫu nhiên");
                                    }}
                                  >
                                    <Shuffle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`text-foreground hover:text-primary ${
                                      indexSong === -1 &&
                                      index === 0 &&
                                      "cursor-not-allowed"
                                    }`}
                                  >
                                    <SkipBack
                                      className={`w-5 h-5 fill-current`}
                                    />
                                  </Button>
                                  <Button
                                    size="icon"
                                    className="w-10 h-10 bg-foreground hover:bg-foreground/90 text-background rounded-full"
                                    onClick={() => {
                                      dispatch({
                                        type: "setIsPlay",
                                        payload: !isPlay,
                                      });
                                      const audio = audioRef.current;
                                      if (audio) {
                                        if (audio.paused) audio.play();
                                        else audio.pause();
                                      }
                                    }}
                                  >
                                    {isPlay ? (
                                      <Pause className="w-5 h-5 fill-current" />
                                    ) : (
                                      <Play className="w-5 h-5 fill-current ml-0.5" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`text-foreground hover:text-primary`}
                                  >
                                    <SkipForward className="w-5 h-5 fill-current" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`text-muted-foreground hover:text-foreground ${
                                      isLoop
                                        ? "bg-accent text-accent-foreground"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      dispatch({
                                        type: "setIsLoop",
                                        payload: !isLoop,
                                      })
                                    }
                                  >
                                    <Repeat className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-3 w-full">
                                  <span className="text-xs text-muted-foreground w-10 text-right">
                                    {convertMinute(
                                      (progress[0] / 100) *
                                        (audioRef.current?.duration || 0)
                                    )}
                                  </span>
                                  <Slider
                                    value={progress}
                                    onValueChange={hanldeChangeSlider}
                                    max={100}
                                    step={1}
                                    className="flex-1"
                                  />
                                  <span className="text-xs text-muted-foreground w-10">
                                    {convertMinute(
                                      audioRef.current?.duration || 0
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Volume Controls */}
                              <div className="flex items-center gap-3 w-1/4 justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => {
                                    handleVolumeChange(isMuted ? [100] : [0]);
                                    setIsMuted(!isMuted);
                                  }}
                                >
                                  {isMuted ? (
                                    <VolumeX className="w-5 h-5" />
                                  ) : (
                                    <Volume2 className="w-5 h-5" />
                                  )}
                                </Button>
                                <Slider
                                  value={isMuted ? [0] : volume}
                                  onValueChange={handleVolumeChange}
                                  max={100}
                                  step={1}
                                  className="w-24"
                                />
                              </div>
                            </div>
                          </div>
                        </SheetFooter>
                      </>
                    )}
                    {activeTab === 2 && (
                      <div className="h-screen flex justify-center items-center text-4xl font-mono pb-40">
                        <div className="lyric flex flex-col items-center gap-10 overflow-y-auto h-full w-screen">
                          {!dataLyric && <p>Lời bài hát đang cập nhật</p>}
                          {dataLyric &&
                            dataLyric.map((item: any) => {
                              const words = item.words
                                .map((item: any) => item.data)
                                .join(" ");
                              return (
                                <p
                                  data-start-time={item.words[0].startTime}
                                  data-end-time={
                                    item.words[item.words.length - 1].endTime
                                  }
                                >
                                  {words}
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Player */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
          {/* Expanded View */}
          {isExpanded && (
            <div className="fixed inset-0 bg-background z-50 flex flex-col animate-in slide-in-from-bottom">
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <img
                  src={currentSong.thumbnailM}
                  alt="Now Playing"
                  className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl object-cover shadow-2xl shadow-primary/30 mb-8"
                />
                <h2 className="text-2xl font-bold text-foreground text-center">
                  {currentSong.title}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {currentSong.artistsNames}
                </p>

                <div className="w-full max-w-sm mt-8">
                  <Slider
                    value={progress}
                    onValueChange={hanldeChangeSlider}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-6 mt-8">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`text-muted-foreground hover:text-foreground`}
                      >
                        <Shuffle className="w-5 h-5 fill-current" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Phát ngẫu nhiên</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-foreground hover:text-primary ${
                      indexSong === -1 && index === 0 && "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (index > 0) {
                        dispatch({
                          type: "setCurrentSong",
                          payload:
                            indexSong !== -1
                              ? dataSong[indexSong - 1].encodeId
                              : (nextSongInfo as any)[index].encodeId,
                        });
                        dispatch({
                          type: "setIndexSong",
                          payload: indexSong !== -1 ? index : index - 1,
                        });
                        dispatch({
                          type: "setIsPlay",
                          payload: true,
                        });
                        dispatch({
                          type: "setIsLoop",
                          payload: false,
                        });
                      }
                    }}
                  >
                    <SkipBack className="w-7 h-7 fill-current" />
                  </Button>
                  <Button
                    size="icon"
                    className="w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    onClick={() => {
                      dispatch({
                        type: "setIsPlay",
                        payload: !isPlay,
                      });
                      const audio = audioRef.current;
                      if (audio) {
                        if (audio.paused) {
                          audio.play();
                        } else {
                          audio.pause();
                        }
                      }
                    }}
                  >
                    {isPlay ? (
                      <Pause className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (index < nextSongInfo.length) {
                        dispatch({
                          type: "setCurrentSong",
                          payload:
                            indexSong !== -1
                              ? dataSong[indexSong + 1].encodeId
                              : (nextSongInfo as any)[index].encodeId,
                        });
                        dispatch({
                          type: "setIndexSong",
                          payload: indexSong !== -1 ? index : index + 1,
                        });
                        dispatch({
                          type: "setIsPlay",
                          payload: true,
                        });
                        dispatch({
                          type: "setIsLoop",
                          payload: false,
                        });
                      }
                    }}
                  >
                    <SkipForward className="w-7 h-7 fill-current" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    onClick={() => {
                      dispatch({
                        type: "setIsLoop",
                        payload: !isLoop,
                      });
                    }}
                    ref={loopBtn}
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-8 mt-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      isLiked ? "text-accent" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <ListMusic className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                className="absolute top-4 left-1/2 -translate-x-1/2 text-muted-foreground"
                onClick={() => setIsExpanded(false)}
              >
                <ChevronUp className="w-8 h-8 rotate-180" />
              </Button>
            </div>
          )}

          {/* Mini Player */}
          <div
            className="bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex items-center gap-3">
              <img
                src={currentSong.thumbnailM}
                alt="Now Playing"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">
                  {currentSong.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.artistsNames}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`${
                  isLiked ? "text-accent" : "text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="icon"
                className="w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                onClick={() => {
                  dispatch({
                    type: "setIsPlay",
                    payload: !isPlay,
                  });
                  const audio = audioRef.current;
                  if (audio) {
                    if (audio.paused) {
                      audio.play();
                    } else {
                      audio.pause();
                    }
                  }
                }}
              >
                {isPlay ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </Button>
            </div>
            {/* Progress Bar */}
            <div className="h-1 bg-secondary rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress[0]}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
