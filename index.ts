import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import path from "path";
import router from "./routes/noteRoutes";
import { overrideMiddleware } from "./utils/method-override";
import session from "express-session";

const app = express();
let handlebars = exphbs.create({
  helpers: {
    setChecked: function (value, currentValue) {
      if (value === currentValue) {
        return "checked";
      } else {
        return "";
      }
    },
    date: function (date) {
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (today.toISOString().startsWith(date)) {
        return "Heute";
      } else if (tomorrow.toISOString().startsWith(date)) {
        return "Morgen";
      } else {
        return date;
      }
    },
  },
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve("views"));

const sessionUserSettings = (req: any, res: any, next: () => void) => {
  const userSettings = req.session.userSettings || {
    orderBy: "default",
    orderDirection: -1,
  };
  const { orderBy, orderDirection } = req.query;

  if (orderBy) {
    userSettings.orderBy = orderBy;
  }
  if (orderDirection) {
    userSettings.orderDirection = orderDirection;
  }
  req.userSettings = req.session.userSettings = userSettings;

  next();
};

app.use(
  session({
    secret: "casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(sessionUserSettings);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(overrideMiddleware);
app.use(router);
app.use(express.static(path.resolve("public")));

const hostname = "127.0.0.1";
const port = 3001;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
