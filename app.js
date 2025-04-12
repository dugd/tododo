const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    console.log("Here");
    res.send("Welcome");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})