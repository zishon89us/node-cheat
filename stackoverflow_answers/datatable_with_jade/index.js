
//------------------------------------------------------
//Web Link=> https://stackoverflow.com/questions/44604873/unable-to-get-datatables-to-work-with-jade
//Run : node index.js
//------------------------------------------------------


const express = require('express');
const path = require('path');
const app = express();
app.set('views', './templates');
app.set('view engine', 'pug');

const port     = process.env.PORT || 3000;

// routes ======================================================================

app.get('/', async (req, res) => {

    res.render('index', {
        title: 'Node-Cheat',
        items: [{name: 'Apple'}, {name: 'Banana'} ]
    });
});

// launch ======================================================================
app.listen(port, () => console.log(`IThe magic happens on port ${port}!`));