const { Product, User } = require("../models");
const { upload, uploadOnMemory, cloudinary } = require("../../cloudinary");
const { Op } = require("sequelize");

module.exports = {
    async createProduct(req, res) {
        try {
            const id = req.id;

            uploadOnMemory.single("picture")(req, res, async () => {
                if(req.file) {
                    const fileBase64 = req.file.buffer.toString("base64");
                    const file = `data:${req.file.mimetype};base64,${fileBase64}`;
                    const url = `/uploads/$`;

                    cloudinary.uploader.upload(file, async (err, result) => {
                        if(err) {
                            console.log(err);
                            return res.status(400).json({
                                msg: "Failed file uploaded"
                            });
                        }

                        const userId = id

                        const product =  await Product.create({
                            name: req.body.name,
                            image: result.url,
                            price: Number(req.body.price),
                            description,
                            userId: userId,
                            categoryId: Number(req.body.category)
                        });

                        return res.status(200).json({
                            status: "OK",
                            data: product,
                            msg: "Item succefully created"
                        })
                    })
                }
            })
        } 
        catch (error) {
            res.status(400).json({
                status: "FAIL",
                message: error,
            });
        }
    },

    async getAllProduct(req, res) {
        const item = await Product.findAll();
        res.status(200).json({
            status: "OK",
            data: item
        }) 
    },

    async getProductCategory(req, res) {
        const id = req.params.id;
        const item = await Product.findAll({where: {categoryId: id}});
        const count = await Product.count({where: {categoryId: id}});

        res.status(200).json({
            count: count,
            list: item
        })
    },
    
    async getProductbyId(req, res) {
        const id = req.params.id;
        const item = await Product.findAll({
            where: {
                id: id
            }
        })
        res.status(200).json({
            msg: "This is your item",
            data: item
        })
    },

    
}