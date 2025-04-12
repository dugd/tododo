const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Here");
    res.render('index', {text: 'Dugd'});
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})