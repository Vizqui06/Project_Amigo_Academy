const express = require('express');
const https = require('https');
const app = express();
const port = 3005;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('general', { data: require('./index.html') });
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('specific', { data: require('./starwars-api-master/api/id/' + id + '.json') });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});