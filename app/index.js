const express = require("express")
const urlencoded = require("express");
const router = require("./routes/user")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({ origin: "*" }))

app.get("/", (req, res) => {
    res.status(200).json({
        msg: "Fly High and Beyond &#128512"
    })
})

app.get('/documentation.json', (req, res) => res.send(swaggerDocument));
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports = router.apply(app);
