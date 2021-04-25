const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { geoCode } = require("./utils/geocode");
const { forecast } = require("./utils/forecast");
// GET HEROKU PROVIDED PORT OR local
const port = process.env.PORT || 3000;

const app = express();
// point to public dir
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath)); //says where static files live

const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//set engine and views location
app.set("view engine", "hbs");
//set template path
app.set("views", templatePath);

hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Jithu",
  });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About me", name: "Jithu" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    name: "Jithu",
    title: "Help doc",
    info:
      "Using hbs as the default view engine requires just one line of code in your app setup. This will render .hbs files when res.render is called.",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address.",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, langitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(latitude, langitude, (error, data) => {
        if (error) return res.send({ error });
        else {
          return res.send({
            location,
            imageUrl: data.imageUrl,
            forecast: data.stringValue,
            address: req.query.address,
          });
        }
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search)
    return res.send({
      //make sure response is not given twice.
      error: "Must provide search term.",
    });
  res.send({ products: [] });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "Weather",
    name: "Jithu",
    errorMessage: "Article not found !",
  });
});

app.get("/*", (req, res) => {
  res.render("error", {
    title: "Weather",
    name: "Jithu",
    errorMessage: "404 Error: Page not found !",
  });
});

app.listen(port, () => {
  console.log(`Server started ! on port ${port}.`);
});
