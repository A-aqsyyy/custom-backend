import express from "express";
import pool from "./db.js";

const app = express();

app.use(express.json());


// api test
let products = [];

app.post("/products", (req, res) => {
    const product = req.body;

    products.push(product);

    res.json(product);
});

app.get("/products", (req, res) => {
    res.json(products);
});

// update api

app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find((product) => product.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    product.name = req.body.name;
    product.price = req.body.price;

    res.json(product);
});
// delete api
app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json(deletedProduct[0]);
});





// pool query to check database connection

pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.log("database Failed to connect",error);
    } else {
        console.log('database connected', result.rows);
    }
});










app.listen(5000, () => {
    console.log("Server is running on port 5000");
});