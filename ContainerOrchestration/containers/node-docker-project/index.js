const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from inside the container!" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "Healthy" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port: 3000");
});
