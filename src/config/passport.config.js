import passport from "passport";
import local from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";
import GithubStrategy from "passport-github2";

import { cookieExtractor } from "../util.js";
import { createHash, validatePassword } from "../services/auth.js";

import config from "./config.js";
import { userService, cartService } from "../services/index.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { name, email } = req.body;
          const exists = await userService.getUserBy({ email });
          if (exists) {
            return done(null, false, { message: "User Already Exist" });
          }

          const hashedPassword = await createHash(password);
          const cart = await cartService.addCart();

          const newUser = {
            name,
            email,
            password: hashedPassword,
            cartId: cart._id,
          };
          const result = await userService.addUser(newUser);
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        if (email === config.adminEmail && password === config.adminPassword) {
          const userAdmin = {
            id: 0,
            name: "admin",
            role: "admin",
          };
          return done(null, userAdmin);
        }
        let user;

        user = await userService.getUserBy({ email });
        if (!user) {
          return done(null, false, { message: "user not found" });
        }

        const isValidPassword = await validatePassword(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: "invalid password" });
        }

        user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          cart: user.cartId,
        };
        return done(null, user);
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: config.githubClientId,
        clientSecret: config.gitHubClientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubCallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { email, name } = profile._json;
          let user;
          user = await userService.getUserBy({ email });
          if (!user) {
            const cart = await cartService.addCart();
            const newUser = {
              name,
              email,
              password: "",
              cartId: cart._id,
            };
            const result = await userService.addUser(newUser);
            return done(null, result);
          }
          user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cartId: user.cartId,
          };
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    if (id === 0) {
      done(null, {
        role: "admin",
        name: "admin",
      });
    }
    const user = userService.getUserBy({ _id: id });
    return done(null, user);
  });
};

//--------------------------------------- PASSPORT JWT ----------------------------------------//

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.jwtSecret,
    },
    async (payload, done) => {
      return done(null, payload);
    }
  )
);
export default initializePassportStrategies;
