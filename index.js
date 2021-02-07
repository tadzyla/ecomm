const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));


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

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Account created!');
});

app.listen(3002, () => {
    console.log('Listen');
}); 
