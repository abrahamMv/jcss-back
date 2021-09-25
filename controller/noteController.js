
const Note = require("../models/Note");
const { validationResult } = require("express-validator");

exports.createNote = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  
  try {
    const note = new Note(req.body);
    note.creator = req.user.id;
    note.save();
    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ha ocurrido un error desde el servidor");
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.find({ creator: req.user.id }).sort({
      date: -1,
    });
    
    res.json({ note });
  } catch (error) {
    console.log(error);
    res.status(500).send("Ha ocurrido un error desde el servidor");
  }
};

