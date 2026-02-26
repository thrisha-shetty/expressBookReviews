const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({username: username, password: password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


// Get all books (async/await)
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});


// Get book by ISBN (Promise)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(res.status(200).json(book));
    } else {
      reject(res.status(404).json({message: "Book not found"}));
    }
  });
});


// Get books by Author (async/await)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  let filteredBooks = {};

  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  }

  return res.status(200).json(filteredBooks);
});


// Get books by Title (Promise)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  return new Promise((resolve, reject) => {
    let filteredBooks = {};
    for (let key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        filteredBooks[key] = books[key];
      }
    }
    resolve(res.status(200).json(filteredBooks));
  });
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;