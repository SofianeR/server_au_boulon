require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const app = express();
app.use(formidable());
app.use(cors());

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const Contact = require("./Model/Contact");
const User = require("./Model/User");

app.post("/form/contact/submit", async (req, res) => {
  console.log(req.fields);

  if (req.fields.name && req.fields.email && req.fields.message) {
    // const { name, email, message } = req.fields;

    const newContact = new Contact(req.fields);

    await newContact.save();

    res.status(200).json({ message: newContact, statut: "OK" });
  } else {
    res
      .status(400)
      .json({ message: "un ou plusieurs des champs requis manquent" });
  }
});

app.get("/contact/fetch/all", async (req, res) => {
  try {
    const contactList = await Contact.find();
    res.status(200).json({ message: contactList, statut: "OK" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message, statut: "NOK" });
  }
});

app.post("/signup/submit", async (req, res) => {
  const checkUser = await User.findOne({
    email: req.fields.email.toLowerCase(),
  });
  if (!checkUser) {
    try {
      const salt = uid2(32);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);

      const token = uid2(32);

      const newUser = new User({
        email: req.fields.email.toLowerCase(),
        username: req.fields.username,
        salt,
        hash,
        token,
        statut: 1,
      });

      await newUser.save();

      res.status(200).json({
        user: newUser,
        statut: "OK",
      });
    } catch (error) {
      res.status(400).json({ message: error.message, statut: "NOK" });
    }
  } else {
    res
      .status(412)
      .json({ message: "Un compte utilise déja cet email", status: "NOK" });
  }
});

app.post("/login/submit", async (req, res) => {
  console.log(req.fields);

  const { email, password } = req.fields;

  try {
    if (email && password) {
      const checkForUser = await User.findOne({ email: email.toLowerCase() });
      if (checkForUser) {
        // console.log("dans checkforuser" + checkForUser);

        const checkHash = SHA256(password + checkForUser.salt).toString(
          encBase64
        );
        if (checkHash === checkForUser.hash) {
          // console.log("dans checkPassword");

          await checkForUser.save();

          res.status(200).json({
            user: checkForUser,
            statut: "OK",
          });
        } else {
          res
            .status(400)
            .json({ message: "Erreur mail ou mot de passe", statut: "NOK" });
        }
      } else {
        res
          .status(412)
          .json({ message: "Erreur mail ou mot de passe", statut: "NOK" });
      }
    } else {
      res.status(412).json({ message: "Champ(s) manquant(s)", statut: "NOK" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message, statut: "NOK" });
  }
});

app.get("*", async (req, res) => {
  res.json("Page Introuvable");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server launched on PORT : ${process.env.PORT || 4000}. 🦒`);
});
