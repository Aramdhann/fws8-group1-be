var nodemailer = require("nodemailer");

exports.kirimEmail = (dataEmail) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS : true,
        auth: {
          user: "axaphyss@gmail.com", 
          pass: "ogvhxcupbjawimnz",
        }
      });
      return transporter
        .sendMail(dataEmail)
        .then ((info) => console.log(`Email Terkirim : ${info.message}`))
        .catch ((err) => console.log (`Terjadi Kesalahan :${err}`))
      
        // console.log(dataEmail)
}