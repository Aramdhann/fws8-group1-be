const { Op } = require ("sequelize");
const { User } = require ("../models");
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcrypt");
const { uploadOnMemory, cloudinary } = require("../../cloudinary");

module.exports = {
    async Register(req, res) {
        const { username, email, password, confPassword } = req.body;

        if(password !== confPassword){
            return res.status(400).json({
                status: "Failed",
                msg: "Password and confPassword doesn't match"
            })
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            await User.create({
                username: username,
                email: email,
                password: hashPassword
            });
            res.status(200).json({
                status: "OK",
                msg: "Register Success"
            })
        } catch (error) {
            console.log(error);
        }
    },

    async Login(req, res) {
        try {
            const user = await User.findAll({
                where: {
                    email: req.body.email
                }
            });
            const match = await bcrypt.compare(req.body.password, user[0].password);
            if(!match) return res.status(400).json({
                msg: "Wrong Password"
            })

            const id = user[0].id;
            const username = user[0].username;
            const email = user[0].email;
            
            const accessToken = jwt.sign({id, username, email, image, address, phone, city}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            const refreshToken = jwt.sign({id, username, email, image, address, phone, city}, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            await User.update({refresh_token: refreshToken},{
                where:{
                    id: id
                }
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                status: "OK",
                msg: "Login success",
                accessToken
            })
        } catch (error) {
            res.status(404).json({
                status: "Failed",
                msg: "Email doesn't exist!"
            })
        }
    },

    async Logout(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.sendStatus(204);

        const user = await User.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user[0]) return res.sendStatus(204);

        const id = user[0].id;
        
        await User.update({refresh_token: null}, {
            where: {
                id: id
            }
        });
        res.clearCookie('refreshToken');
        return re.sendStatus(200)
    },

    async getUser(req, res) {
        try {
            const id = req.id;
            console.log("Req :", req.id);
    
            const user = await User.findOne({
                where: { id: id },
                attributes: ['image', 'username', 'email', 'phone', 'address']
            })
            console.log("user data : ",user);
    
            return res.status(200).json({
                status: "OK",
                msg: "User data retrieved successfully",
                data: user
            })
        } catch (error) {
            console.log(error)
            res.status(402).json({
                status: "Failed",
                msg: "Failed to get user data"
            })
        }
    },

    async updateUser(req, res) {
        try{
            const id = req.id;
            const initial = await User.findAll({ where: { id } });

            if (req.file) {
                uploadOnMemory.single("picture")(req, res, async function () {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;
                const url = `/uploads/$`;

                cloudinary.uploader.upload(file, async function (err, result) {
                    if (err) {
                    console.log(err);
                    return res.status(400).json({
                        message: "gagal upload file",
                    });
                    }
                    const user = User.update(
                    {
                        username: req.body.username
                        ? req.body.username
                        : initial.username,
                        image: result.url ? result.url : initial.image,
                        address: req.body.address ? req.body.address : initial.address,
                        phone: req.body.nomorhp
                        ? req.body.nomorhp
                        : initial.phoneNumber,
                        city: req.body.city ? req.body.city : initial.city
                    },
                    { where: { id } }
                    );

                    res.status(201).json({
                    status: "OK",
                    data: user,
                    message: "User succesfully updated",
                    });
                });
                });
            } else if (!req.file) {
                const user = User.update(
                {
                    username: req.body.username ? req.body.username : initial.username,
                    address: req.body.address ? req.body.address : initial.address,
                    phoneNumber: req.body.nomorhp
                    ? req.body.nomorhp
                    : initial.phoneNumber,
                    image: "",
                    city: req.body.city ? req.body.city : initial.city
                },
                { where: { id } }
                );

                res.status(201).json({
                status: "OK",
                data: user,
                message: "User succesfully updated",
                });
            }
        }catch(error){
            res.status(422).json({
                status: "Failed",
                msg: error.message
            })
            console.log(error);
        }
    }
}
