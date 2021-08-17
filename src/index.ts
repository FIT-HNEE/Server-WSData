import express, { Application } from 'express';

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.get("/Hello", async (req, res) => {
    res.send({
        message: "Hello World"
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})