function karaokeScript(dataLyric: any, title: string, artists: string) {
  let currentSceen: any;
  let cleanUp: any;
  const audio: any = document.getElementById("audio");
  let prevIndex = 0;
  const karaokeUpdate = () => {
    cleanUp = setInterval(() => {
      if (!audio.paused) {
        const karaokeContent: any = document.querySelector(".karaoke-content");
        const currentTime = audio?.currentTime * 1000;
        let index = dataLyric.findIndex((sentence: any) => {
          sentence = sentence.words;
          return (
            currentTime >= sentence[0].startTime &&
            currentTime <= sentence[sentence.length - 1].endTime
          );
        });
        if (index !== -1) {
          prevIndex = index;
        }
        const firstTime = dataLyric[0].words[0].startTime;
        if (currentTime - firstTime < -5000 && title && artists) {
          if (karaokeContent) {
            karaokeContent.innerHTML = `<p>${title}</p><p>${artists}</p>`;
          }
        }
        if (currentTime - firstTime > -5000 && currentTime - firstTime < 0) {
          index = 0;
        }
        if (index === -1 && currentTime >= firstTime) index = prevIndex + 1;
        if (index !== -1) {
          const screen = Math.floor(index / 2 + 1);
          const offset = Math.floor((screen - 1) * 2);

          if (screen !== currentSceen) {
            let pTag = "";
            for (let i = offset; i < offset + 2; i++) {
              const sentence = dataLyric[i].words
                .map(
                  (item: any) =>
                    `<span data-start-time="${item.startTime}" data-end-time="${item.endTime}">${item.data}<span>${item.data}</span></span>`
                )
                .join(" ");
              pTag += `<p>${sentence}</p>`;
            }
            if (karaokeContent) karaokeContent.innerHTML = pTag;
            currentSceen = screen;
          }
          const karaokeLyric = document.querySelectorAll(".karaoke p");
          if (karaokeLyric.length > 0) {
            const sentenceEl = karaokeLyric[index % 2].children;
            Array.from(sentenceEl).forEach((item: any) => {
              const startTime = item.dataset.startTime;
              const endTime = item.dataset.endTime;
              if (currentTime >= startTime - 100) {
                const time = endTime - startTime;
                item.children[0].style.transition = `width ${time}ms ease`;
                item.children[0].style.width = "100%";
              }
            });
          }
        }
      }
    }, 16);
  };

  karaokeUpdate();
  // audio.addEventListener("play", karaokeUpdate);
  // audio.addEventListener("pause", clear);
  // audio.addEventListener("ended", clear);
  return () => {
    try {
      clearInterval(cleanUp);
      // audio.addEventListener("play", karaokeUpdate);
      // audio.removeEventListener("pause", clear);
      // audio.removeEventListener("ended", clear);
    } catch (error) {
      console.log(error);
    }
  };
}
export default karaokeScript;
