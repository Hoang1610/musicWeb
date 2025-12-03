import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function capitalizeFirstLetter(str: string) {
  if (!str) {
    return "";
  }
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1);
  return firstLetter + restOfString;
}
export function convertHour(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds / 100));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  return `${hours > 0 ? hours : "0" + String(hours)} giờ ${
    minutes > 0 ? minutes : "0" + String(minutes)
  } phút`;
}
export function shuffleArray<T>(array: T[]): T[] {
  // Tạo một bản sao của mảng để không làm thay đổi mảng gốc
  const newArray = [...array];
  let currentIndex = newArray.length;
  let randomIndex;

  // Trong khi vẫn còn phần tử để trộn
  while (currentIndex !== 0) {
    // Chọn một phần tử còn lại một cách ngẫu nhiên
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Và hoán đổi nó với phần tử hiện tại
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}
export function convertMinute(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const GIAY_TRONG_PHUT = 60;
  const minutes = Math.floor(s / GIAY_TRONG_PHUT);
  const seconds = s % GIAY_TRONG_PHUT;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
export function getMusicPlayer(
  song: any,
  dispatch: ({ type, payload }: { type: string; payload: any }) => void
) {
  dispatch({
    type: "setCurrentSong",
    payload: song.encodeId,
  });
  dispatch({
    type: "setNextSong",
    payload: song.artists ? song?.artists[0].id : null,
  });
  dispatch({
    type: "setIndexSong",
    payload: 0,
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
