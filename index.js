require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const app = express();
app.use(formidable());
app.use(cors());

const Contact = require("./Model/Contact");

app.post("/form/contact/submit", async (req, res) => {
  console.log(req.fields);

  if (req.fields.name && req.fields.email && req.fields.message) {
    const { name, email, message } = req.fields;

    const newContact = new Contact(req.fields);

    await newContact.save();

    res.status(200).json({ message: newContact, statut: "OK" });
  } else {
    res
      .status(400)
      .json({ message: "un ou plusieurs des champs requis manquent" });
  }
});

app.get("*", async (req, res) => {
  res.json("Page Introuvable");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server launched on PORT : ${process.env.PORT || 4000}. 🦒`);
});
