const express = require('express');
const app = express();
const path = require('path');
const port = 2000;

app.use(express.json());
app.use('/api/todo/', require(path.join(__dirname, 'modules/users/route.js')))

app.listen(port, () => {
    console.log(`App is running on : ${port}`);
})