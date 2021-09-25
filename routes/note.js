const express = require("express");
const router = express.Router();
const noteController = require("../controller/noteController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

router.post(
  "/",
  auth,
  [check("name", "El nombre de la nota es obligatorio.").not().isEmpty()],
  [check("note", "El texto es obligatorio.").not().isEmpty()],
  
  noteController.createNote
);

router.get("/", auth, noteController.getNote);







module.exports = router;
