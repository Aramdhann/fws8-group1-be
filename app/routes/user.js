const express = require("express");
const { refreshToken } = require("../controllers/refreshToken");
const { 
    Register, 
    Login, 
    Logout, 
    getUser, 
    updateUser 
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyToken");
const cloudinary = require("../../cloudinary/cloudinary");
const  upload = require("../../cloudinary/multer");
const { User } = require ("../models");
const { Op } = require ("sequelize");


function apply(app) {
    app.post("/api/user/register", Register);
    app.post("/api/user/login", Login);
    app.get("/api/user/token", refreshToken);
    app.delete("/api/user/logout", Logout);
    app.get("/api/user", verifyToken, getUser);
    app.put("/api/user/data", verifyToken, upload.single("image"), updateUser);


    return app;
}

module.exports = { apply };