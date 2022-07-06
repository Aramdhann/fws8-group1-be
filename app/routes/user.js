const express = require("express");
const { refreshToken } = require("../controllers/refreshToken");
const { verifyToken } = require("../middleware/verifyToken");
const cloudinary = require("../../cloudinary/cloudinary");
const  upload = require("../../cloudinary/multer");
const { 
    Register, 
    Login, 
    Logout, 
    getUser, 
    updateUser 
} = require("../controllers/userController");
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getProductCategory,
    getProductbyId,
    getAllSellerProduct
} = require("../controllers/productController")

function apply(app) {
    app.post("/api/user/register", Register);
    app.post("/api/user/login", Login);
    app.get("/api/user/token", refreshToken);
    app.delete("/api/user/logout", Logout);
    app.get("/api/user", verifyToken, getUser);
    app.put("/api/user/data", verifyToken, upload.single("image"), updateUser);

    // Product
    app.post("/api/product/create", verifyToken, createProduct);
    app.put("/api/product/:id", verifyToken, updateProduct);
    app.delete("/api/product/:id", verifyToken, deleteProduct);
    app.get("/api/product/findall", getAllProduct);
    app.get("/api/product/findcategory", getProductCategory);
    app.get("/api/product/findOne", getProductbyId);
    app.get("/api/product/sellerproduct", verifyToken, getAllSellerProduct);


    return app;
}

module.exports = { apply };