const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
const usersRepo = require('./repositories/users')


app.get('/', (req, res) => {  //someone makes a network request, callback function will run
    res.send(`
    <div>
        <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>sign up</button>
        </form>
    </div>
    `);
});

app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({email});
    if(existingUser) {
        return res.send('Email is in use');
    }
    if(password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }
    res.send('Account created!');
});

app.listen(3002, () => {
    console.log('Listen');
}); 
