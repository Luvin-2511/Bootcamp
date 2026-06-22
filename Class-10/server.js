const express = require("express");

const app = express()

app.listen(3000, () => {
    console.log(`Server listening at PORT:${3000}`);
})

// const { add, subtract } = require("./math");

// console.log(add(2, 67));
// console.log(subtract(71, 2));
