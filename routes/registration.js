const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')({ capSQL: true });
const createError = require('http-errors');
const UserModel = require('../models/userModel');
const User = new UserModel();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    
    const duplicate = await User.findOneByUsername(username);
    if (duplicate) return res.sendStatus(409); 

    try {
        const hashedPwd = await bcrypt.hash(password, 10);

        const result = await User.create({
            "username": username,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

router.post('/register', handleNewUser);

module.exports = router