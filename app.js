const express = require('express')
const path = require('path')

const app = express()
const port = 3000


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static( "public" ) );

const mainRouter = require('./router/mainRouter');

app.use('/', mainRouter);

app.listen(port, () => {
  console.log(`Server started on PORT = ${port}`)
})