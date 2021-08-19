let videos = [];
let selectButtons = [];
let initialTimes = [876, 1076, 1272, 1479.5];

document.getElementById("instructions-modal-button").addEventListener("click", function() {
  const modal = document.getElementById("instructions-modal");
  modal.style.zIndex = "1";
  modal.style.opacity = "1";
});

document.getElementById("exit-modal").addEventListener("click", function() {
  const modal = document.getElementById("instructions-modal");
  modal.style.zIndex = "-1";
  modal.style.opacity = "0";
});

const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const zulrahHeader = document.getElementById("page-title");
const videoContainers = document.getElementsByClassName("container", "video-option");
const mainBody = document.getElementsByClassName("main-body")[0];

startButton.addEventListener("click", () => { begin() });
resetButton.addEventListener("click", () => { setInitialTimes() });

for ( let i = 0; i < videoContainers.length; i++ ) {
  const container = videoContainers[i];
  const clickOption = document.createElement("div");
  clickOption.id = `select-${i}`;
  clickOption.innerHTML = `rotation #${i + 1}`;
  clickOption.classList.add("click-option", "btn", "btn-sm", "btn-primary");
  clickOption.addEventListener("click", () => {selectVideo(i)});
  selectButtons.push(clickOption);
  container.appendChild(clickOption);

  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video-container");
  container.appendChild(videoContainer);

  const video = document.createElement("video")
  video.src = "./media/Zulrah.mp4";
  video.setAttribute("type", "video/mp4");
  video.setAttribute("disablepictureinpicture", "");
  video.setAttribute("preload", "auto");
  videoContainer.appendChild(video);

  videos.push(video);

  setInitialTimes();
}

function setInitialTimes() {
  videos.forEach((video, i) => {
    video.muted = true;
    video.currentTime = initialTimes[i]
    video.pause();
  });
  zulrahHeader.innerHTML = "Zulrah helper";
  for(let i = 0; i < 4; i++) {
    videoContainers[i].style.display = "grid";
  }
  mainBody.style.gridTemplateColumns = `repeat(2, minmax(200px, 50%))`;
}

function begin() {
  zulrahHeader.innerHTML = "3";
  window.setTimeout(() => {zulrahHeader.innerHTML = "2"}, 1000);
  window.setTimeout(() => {zulrahHeader.innerHTML = "1"}, 2000);
  window.setTimeout(() => {
    zulrahHeader.innerHTML = "GO"
    videos.forEach(video => video.play())
  }, 3000); 
}

function selectVideo(n) {
  for( let i = 0; i < videoContainers.length; i++ ) {
    const container = videoContainers[i];
    const video = videos[i];
    if( n !== i ) {
      container.style.display = "none";
    } else {
      video.muted = false;
    }
  };
  mainBody.style.gridTemplateColumns = "1fr";
}