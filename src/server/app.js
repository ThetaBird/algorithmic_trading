const express = require("express");
const path = require("path");

const PORT = 8080;
const app = express();

let publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));