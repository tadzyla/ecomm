const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { 
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation,
    requireEmailExists,
    requirePasswordForUser
} = require('./validators');
const router = express.Router();

router.get('/signup', (req, res) => {  //someone makes a network request, callback function will run
    res.send(signupTemplate({ req }));
});

router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),
    async (req, res) => { 
    const { email, password } = req.body;

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
    res.send(signinTemplate({}))
})

router.post('/signin', [requireEmailExists, requirePasswordForUser],
handleErrors(signinTemplate),
async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({email});
    
    req.session.userId = user.id;
    res.send('You are signed in!');
});

module.exports = router;