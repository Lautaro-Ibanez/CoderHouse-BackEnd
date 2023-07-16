import passport from "passport";
import local from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";
import GithubStrategy from "passport-github2";

import { cookieExtractor } from "../util.js";
import { createHash, validatePassword } from "../services/auth.js";

import {
  usersService,
  cartsService,
} from "../dao/mongo/mongoManagers/index.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { name, role } = req.body;
          const exists = await usersService.getUserBy({ email });
          if (exists)
            return done(null, false, { message: "User Already Exist" });

          const hashedPassword = await createHash(password);
          const cart = await cartsService.addCart();

          const user = {
            name,
            email,
            password: hashedPassword,
            role,
            cartId: cart._id,
          };

          const result = await usersService.addUser(user);

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
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          const userAdmin = {
            id: 0,
            name: "admin",
            role: "Admin",
          };
          return done(null, userAdmin);
        }
        let user;

        user = await usersService.getUserBy({ email });
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
        clientID: "Iv1.44f65959f1bef658",
        clientSecret: "9033baeca10566e6169b92b3caa7acd83651ef01",
        callbackURL: "http://localhost:8080/api/sessions/githubCallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { email, name } = profile._json;
          const user = usersService.getUserBy({ email });
          if (!user) {
            const newUser = {
              name,
              email,
              password: "",
            };
            const result = await usersService.addUser(newUser);
            return done(null, user);
          }
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
    const user = usersService.getUserBy({ _id: id });
    return done(null, user);
  });
};

//--------------------------------------- PASSPORT JWT ----------------------------------------//

passport.use(
  "jwt",
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: "jwtSecret",
    },
    async (payload, done) => {
      return done(null, payload);
    }
  )
);
export default initializePassportStrategies;
