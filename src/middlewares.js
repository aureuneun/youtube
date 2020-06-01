import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import routes from "./routes";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_CLIENT_ID,
  secretAccessKey: process.env.AWS_S3_CLIENT_SECRET,
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    bucket: "s3wetube/videos",
    acl: "public-read",
  }),
});

const multerAvatar = multer({
  storage: multerS3({
    s3,
    bucket: "s3wetube/avatars",
    acl: "public-read",
  }),
});

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
