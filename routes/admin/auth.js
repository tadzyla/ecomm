const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const router = express.Router();

router.get('/signup', (req, res) => {  //someone makes a network request, callback function will run
    res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({email});
    if(existingUser) {
        return res.send('Email is in use');
    }
    if(password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    // create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    // store the id of that user in the users cookie
   req.session.userId = user.id;

    res.send('Account created!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are loged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate())
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({email});

    if(!user) {
        return res.send('Email is not found'); // OK
    }
    const validPassword = await usersRepo.comparePasswords(
        user.password, 
        password
    );
    if(!validPassword){
        return res.send('Password is wrong');
    }
    req.session.userId = user.id;
    res.send('You are signed in!');
});

module.exports = router;