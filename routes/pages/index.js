const express = require("express");

const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', {text: 'Dugd'});
});

router.post('/echo', (req, res) => {
    res.send(req.body);
})


module.exports = router;