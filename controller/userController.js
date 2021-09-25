const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


exports.newUser = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password, number } = req.body; 

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
     let numero = await User.findOne({ number });
     if (numero) {
       return res.status(400).json({ msg: "El número ingresado ya existe" });
     }
    console.log(req.body);
    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token: token, user: user });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Ha ocurrido un error desde el servidor");
  }
};

exports.tempPassword = async (req,res)=>{
  const {email} = req.body
  
  try {
    let findUser = await User.find({email});
    if(findUser){
     console.log(findUser);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jcssprueba@gmail.com',
            pass: 'pruebasparatrabajar'
        },
     
    });

        const mailOptions = {
          from: 'no se ',
          to: findUser[0].email,
          subject: 'Asunto',
          text: 'Acceda al siguiente enlace para recuperar su contraseña  http://localhost:3000/'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error){
          console.log(error);
          console.log(mailOptions.to);
      } else {
          console.log("Email sent");
          res.status(200).jsonp(req.body);
         
           
      }
  });

  return res.json({ user: findUser, link: "http://localhost:3000/"} );
    }else{
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    
  } catch (error) {
    console.log(error);
    res.status(500).send("Ha ocurrido un error desde el servidor");
  }
}

exports.updatePassword = async (req, res) => {
  const { password, _id } = req.body;
  const newUser = {};
  if (_id) {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
   
  }

  try {
    let user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    user = await User.findByIdAndUpdate(
      { _id: _id },
      { $set: newUser },
      { new: true }
    );

    res.json({ user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Ha ocurrido un error al cambiar tu contraseña." });
  }
};

