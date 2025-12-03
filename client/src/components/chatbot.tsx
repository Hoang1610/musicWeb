import { useState, useRef, useEffect, type FormEvent } from "react";
import { Bot, Send, LoaderCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch } from "@/store/hook";
import { getMusicPlayer } from "@/lib/utils";
import { toast } from "sonner";
import axios from "@/axios";

interface Message {
  sender: "user" | "bot";
  text?: string;
  songs?: any[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: "bot",
          text: "Xin chào! Bạn muốn nghe thể loại nhạc gì hôm nay?",
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      // The viewport is the actual scrollable element in shadcn/ui's ScrollArea
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await axios.post("/chat", { message: input });
      const botMessage: Message = {
        sender: "bot",
        text: "Dựa trên yêu cầu của bạn, tôi có vài gợi ý sau:",
        songs: result.data.data, // Thay fakeSongs bằng songs từ API response
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        sender: "bot",
        text: "Xin lỗi, tôi đã gặp lỗi khi tìm kiếm. Bạn thử lại sau nhé.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Không thể kết nối đến AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = (song: any, songs: any[]) => {
    getMusicPlayer(song, dispatch);
    dispatch({
      type: "setDataSong",
      payload: songs,
    });
    toast.success(`Đang phát: ${song.title}`);
  };

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-7 h-7" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot /> AI Music Assistant
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 min-h-0" ref={scrollAreaRef}>
            <div className="px-6 space-y-4 py-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Bot size={20} />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    {msg.text && (
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                    {msg.songs && (
                      <div className="space-y-2 mt-2">
                        {msg.songs.map((song) => (
                          <div
                            key={song.encodeId}
                            className="bg-secondary p-2 rounded-md flex items-center gap-3 w-[80%]"
                          >
                            <img
                              src={song.thumbnail}
                              alt={song.title}
                              className="w-10 h-10 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {song.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {song.artistsNames}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handlePlaySong(song, msg.songs!)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>
                  <div className="rounded-lg px-3 py-2 bg-secondary flex items-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Đang tìm kiếm...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI để tìm bài hát..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
