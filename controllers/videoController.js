import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (e) {
    console.log(e);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
    res.render("search", { pageTitle: "Search", searchingBy, videos });
  } catch (e) {
    console.log(e);
  }
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path },
  } = req;
  try {
    const newVideo = await Video.create({
      videoFile: path,
      title,
      description,
    });
    res.redirect(routes.videoDetail(newVideo.id));
  } catch (e) {
    console.log(e);
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById({ _id: id });
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (e) {
    console.log(e);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById({ _id: id });
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (e) {
    console.log(e);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    body: { title, description },
    params: { id },
  } = req;
  try {
    await Video.findByIdAndUpdate(id, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (e) {
    console.log(e);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await Video.findByIdAndRemove(id);
    res.redirect(routes.home);
  } catch (e) {
    console.log(e);
  }
};
