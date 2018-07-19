const express = require('express');
const app = express();

app.use('/', express.static('../target'));

app.listen(3000, () => {
    console.log("[SERVER] Running on port 3000");
    setTimeout(() => {
        //open("http://localhost:3000");
    }, 0);
});