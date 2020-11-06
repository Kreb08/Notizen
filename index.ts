import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import path from "path";
import router from "./routes/noteRoutes";
import session from "express-session";

const app = express();
let handlebars = exphbs.create({
  helpers: {
    isSet: function (value, trueValue) {
      return value === trueValue;
    },
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
    invertFilter: function (string) {
      if (string === "on") {
        return "off";
      } else {
        return "on";
      }
    },
    invertTheme: function (theme) {
      if (theme === "dark") {
        return "default";
      } else {
        return "dark";
      }
    },
    invertOrderDirection: function (direction) {
      if (direction.startsWith("-")) {
        return direction.substring(1);
      }
      return "-" + direction;
    },
  },
});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve("views"));

const sessionUserSettings = (req: any, res: any, next: () => void) => {
  const userSettings = req.session.userSettings || {
    orderBy: "finishDate",
    orderDirection: 1,
    filter: "off",
    theme: "default",
  };
  const { orderBy, orderDirection, filter, theme } = req.query;

  if (orderBy) {
    userSettings.orderBy = orderBy;
  }
  if (orderDirection) {
    userSettings.orderDirection = orderDirection;
  }
  if (filter) {
    userSettings.filter = filter;
  }
  if (theme) {
    userSettings.theme = theme;
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
app.use(router);
app.use(express.static(path.resolve("public")));

const hostname = "127.0.0.1";
const port = 3001;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
