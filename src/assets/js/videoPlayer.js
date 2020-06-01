const videoContainer = document.querySelector(".video-detail__container");
const videoViews = document.querySelector(".video__views");
const video = document.querySelector(".video__player video");

const registerView = () => {
  const id = window.location.href.split("/videos/")[1];
  fetch(`/api/${id}/view`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((json) => {
      videoViews.innerHTML =
        json.views === 1 ? `${json.views} view` : `${json.views} views`;
    });
};

const videoPlayerInit = () => {
  video.addEventListener("ended", registerView);
};

if (videoContainer) {
  videoPlayerInit();
}
