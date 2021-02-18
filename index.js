const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true})); //middleware 
app.use(
    cookieSession({
    keys: ['xnw738reg'] // include keys is important, because cookie-session will
  })                     // encrypt cookie information about the user
);
app.use(authRouter);

app.listen(3000, () => {
    console.log('Listen');
}); 
