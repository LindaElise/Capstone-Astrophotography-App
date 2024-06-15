
const express = require(`express`);
const axios = require(`axios`);
const fs = require(`fs`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let apiKeyNasa = `pZ9fXrn1kHCKKKnrCeCexklmkhpp6QyZAToobq72`;
let mainPage = `https://apod.nasa.gov/apod/image/2301/PaleBlueDotOrig_Voyager1_960.jpg`;

var users = require(`./Users.json`);

app.post(`/api/checkFavourite`, (istek, cevap) => {
  const { token, date } = istek.body;
  const user = users.find(u => u.token == token);
  if (user) {
    if (user.Favourites.filter(filtre => new Date(filtre.date).toISOString().split(`T`)[0] == new Date(date).toISOString().split(`T`)[0]).length > 0) {
      cevap.json({ success: true, data: true });
    }
    else {
      cevap.json({ success: true, data: false });
    }
} else {
    cevap.json({ success: false, message: "User not found" });
};
});

app.post(`/api/setFavourite`, (req, res) => {
    const { token, situation, date, image } = req.body;
    const user = users.find(u => u.token == token);
    if (user) {
        if (situation == `add` && date && image) {
            users.filter(filtre => filtre.token == token)[0].Favourites.push({
                date,
                image
            });
            res.json({ success: true });
        } else if (situation == `remove` && date) {
            users.filter(filtre => filtre.token == token)[0].Favourites = users.filter(filtre => filtre.token == token)[0].Favourites.filter(filtre => filtre.date !== date);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Wrong api usage." });
        }
    } else {
      res.status(401).json({ success: false, message: `Invalid credentials` });
    }
});

app.post(`/api/seeFavourites`, (req, res) => {
    const { token } = req.body;
    const user = users.find(u => u.token == token);
    if (user) {
        res.json({ success: true, images: user.Favourites.sort((a, b) => new Date(b.date) - new Date(a.date)) });
    } else {
      res.status(401).json({ success: false, message: `Invalid credentials` });
    }
});

app.post(`/api/login`, (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, token: user.token });
  } else {
    res.status(401).json({ success: false, message: `Invalid credentials` });
  }
});

app.post(`/api/signup`, (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: `Email already exists` });
  }
  const newUser = { email, password, token: Buffer.from(`${email}2586!DBpassDB!6852${password}`, `utf-8`).toString(`base64`), Favourites: [] };
  users.push(newUser);
  res.json({ token: newUser.token, success: true });
});

app.get(`/api/image`, (istek, cevap) => {
  if (istek.query.date && new Date(istek.query.date)) {
  axios({
    method: `get`,
    url: `https://api.nasa.gov/planetary/apod?date=${new Date(istek.query.date).toISOString().split(`T`)[0]}&api_key=${apiKeyNasa}`
  }).then(async (cevap1) => {
    if (cevap1.data.code || cevap1.data.media_type !== `image`) {
        cevap.json({ imageUrl: `${mainPage}`, description: "" });
    }
    else {
        cevap.json({ imageUrl: cevap1.data.hdurl ? cevap1.data.hdurl : cevap1.data.url, description: cevap1.data.explanation ? cevap1.data.explanation : `` });
    }
  }).catch(async (hata1) => {
    cevap.json({ imageUrl: `${mainPage}`, description: "" });
  });
} else {
    cevap.json({ imageUrl: `${mainPage}`, description: "" });
};
});

setInterval(async() => {
    console.log(`Database is saving...`);
    fs.writeFileSync(`./Users.json`, JSON.stringify(users, null, 2));
    console.log(`${new Date().toString()} >> Database has been saved . It'll be saved again in 60 seconds.`);
}, 60000);

app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
});
