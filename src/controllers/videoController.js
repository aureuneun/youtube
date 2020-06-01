import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

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
    file: { location },
  } = req;
  console.log(req.file);
  try {
    const newVideo = await Video.create({
      videoFile: location,
      title,
      description,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
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
    const video = await Video.findById({ _id: id })
      .populate("creator")
      .populate("comments");
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
    if (video.creator != req.user.id) throw Error();
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (e) {
    console.log(e);
    res.redirect(routes.home);
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
    user,
  } = req;
  try {
    const video = await Video.findById({ _id: id });
    user.videos.remove({ _id: id });
    await Comment.remove({});
    user.save();
    if (video.creator != req.user.id) throw Error();
    await Video.findByIdAndRemove(id);
  } catch (e) {
    console.log(e);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById({ _id: id });
    video.views += 1;
    video.save();
    res.status(200).json({ views: video.views });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById({ _id: id }).populate("comments");
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    user.comments.push(newComment.id);
    video.save();
    user.save();
    const length = video.comments.length;
    res.status(200).json({ newComment, length });
  } catch (e) {
    console.log(e);
    res.redirect(routes.login);
  }
};

export const postRemoveComment = async (req, res) => {
  const {
    params: { id },
    body: { commentId },
    user,
  } = req;
  try {
    const video = await Video.findById({ _id: id }).populate("comments");
    await video.comments.remove({ _id: commentId });
    await user.comments.remove({ _id: commentId });
    await Comment.findByIdAndRemove({ _id: commentId });
    video.save();
    user.save();
    const length = video.comments.length;
    res.status(200).json({ length });
  } catch (e) {
    console.log(e);
    res.redirect(routes.home);
  }
};
