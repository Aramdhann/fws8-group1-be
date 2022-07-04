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

function apply(app) {
    app.post("/api/user/register", Register);
    app.post("/api/user/login", Login);
    app.get("/api/user/token", refreshToken);
    app.delete("/api/user/logout", Logout);
    app.get("/api/user", verifyToken, getUser);
    app.put("/api/user/data", verifyToken, updateUser);


    return app;
}

module.exports = { apply };