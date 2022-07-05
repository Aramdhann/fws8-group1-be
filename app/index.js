const express = require("express")
const router = require("./routes/user")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer")
const forms = multer();

app.use(express.json());
app.use(express.static("../public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: "*" }))

app.get("/", (req, res) => {
    res.status(200).json({
        msg: "Fly High and Beyond &#128512"
    })
})

app.use(forms.array());

module.exports = router.apply(app);
