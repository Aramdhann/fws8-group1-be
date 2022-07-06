const { Product, User } = require("../models");
const { Op } = require("sequelize");

module.exports = {
    async createProduct(req, res) {
        const id = req.id;
        try {
            
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                type: req.body.type,
                user: id,
                image: result.url ? result.url : initial.image
            }

            const product = await Product.create(data);
            res.status(200).json({
                status: "OK",
                msg: "Item succefully created",
                data: product,
            })
        } catch(err) {
            res.status(400).json({
                status: "FAIL",
                message: error,
            });
        }
    },

    async updateProduct(req, res) {
        const id = req.id;
        try {
            
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                type: req.body.type,
                user: id,
                image: result.url
            }

            const product = await Product.update(data, {where: {id: req.params.id}});
            res.status(200).json({
                status: "OK",
                msg: "Item succefully updated",
                   data: product,
            })
        } catch(err) {
            res.status(400).json({
                status: "FAIL",
                message: error,
            });
        }
    },

    async deleteProduct(req, res) {
        try {
            const id = req.id;
            
            await User.findByPk({where: { id: id }});

            const item = await Product.destroy({
                where: { [Op.and]: [{id: req.params.id}, {userId: id}] }
            })

            if(!!item) {
                res.status(404).json({
                    deletedBy: req.result,
                    msg: "Product not found"
                })
            }
            res.json({
                msg: "Product successfully deleted"
            })
        } catch(error) {
            res.status(400).json({
                status: "Fail",
                msg: error.message
            })
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
            items: item
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

    async getAllSellerProduct(req, res) {
        try {
            const id = req.id;

            await User.findByPk(id);

            const product = await Product.findAll({where: {userId: id}});
            const productCount = await Product.count({where: {userId: id}});

            res.satus(200).json({
                productCount: productCount,
                product: product
            })
        }catch(error) {
            res.status(400).json({
                status: "Fail",
                msg: "Sorry there is something wrong"
            })
        }
    }
}