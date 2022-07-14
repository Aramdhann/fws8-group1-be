const { Op } = require ("sequelize");
const { users } = require ("../models");
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcrypt");
const cloudinary = require("../../cloudinary/cloudinary");
const upload = require("../../cloudinary/multer");
const {kirimEmail} = require('../middleware/emailVerif')

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
            await users.create({
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

        //verif email
        const templateEmail = {
            from : 'SecondHand',
            to : email,
            subject : 'Email Verification',
            html : 'Halo! Terimakasih sudah mendaftar di SecondHand! Silahkan klik link dibawah untuk memverifikasi akun anda http://localhost:8000'
         }
         kirimEmail (templateEmail)
    },

    async Login(req, res) {
        try {
            const user = await users.findAll({
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
            const address = user[0].address;
            const phone = user[0].phone;
            const city = user[0].city;
            const image = user[0].image;
            
            const accessToken = jwt.sign({id, username, email, address, phone, city, image}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            const refreshToken = jwt.sign({id, username, email}, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            await users.update({refresh_token: refreshToken},{
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

        const user = await users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user[0]) return res.sendStatus(204);

        const id = user[0].id;
        
        await users.update({refresh_token: null}, {
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
    
            const user = await users.findOne({
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
        const id = req.id;
        try {
            
            const result = await cloudinary.uploader.upload(req.file.path);
            const data = {
                username: req.body.username,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                image: result.url ? result.url : initial.image
            }

            const userData = await users.update(data,{where: {id: id}});
            res.status(200).json({
                status:"Success",
                msg: "Update profile success",
                data: data
            });
        } catch(err) {
            res.status(200).json({
                status:"Failure",
                msg: "Update data has been failure",
            });
            console.log(err);
        }
    }
}
