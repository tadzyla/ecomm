const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users')
const app = express();


app.use(bodyParser.urlencoded({ extended: true}));

app.use(
    cookieSession({
    keys: ['xnw738reg'] // include keys is important, because cookie-session will
  })                     // encrypt cookie information about the user
);

app.get('/signup', (req, res) => {  //someone makes a network request, callback function will run
    res.send(`
    <div>
       Your ID is ${req.session.userId}
        <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign up</button>
        </form>
    </div>
    `);
});

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are loged out');
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign in</button>
        </form>
    </div>
    `
    )
})

app.post('/signin', async (req, res) => {
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

app.listen(3000, () => {
    console.log('Listen');
}); 
