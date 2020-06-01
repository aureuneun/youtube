import passport from "passport";
import GitHubStrategy from "passport-github";
import NaverStrategy from "passport-naver";
import User from "./models/User";
import {
  githubLoginCallback,
  naverLoginCallback,
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://newwetube.herokuapp.com${routes.githubCallback}`
        : `http://localhost:5000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://newwetube.herokuapp.com${routes.naverCallback}`
        : `http://localhost:5000${routes.naverCallback}`,
    },
    naverLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
