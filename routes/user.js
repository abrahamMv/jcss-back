const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { check } = require("express-validator");

router.post(
  "/",
  [
    check("name", "Se requiere un nombre").not().isEmpty(),
    check("email", "Email required").isEmail(),
    check("password", "password minimum 8 characters").isLength({ min: 8 }),
    check(
      "number",
      "El número de telefono debe tener solo 10 números."
    ).isLength({ min: 10, max: 10 }),
  ],
  userController.newUser
);

router.post(
  "/email",
  [check("email", "Email required").isEmail()],
  userController.tempPassword
)

router.put(
  "/",
  [check("_id", "La id es requerida.")],
  userController.updatePassword
)




module.exports = router;
