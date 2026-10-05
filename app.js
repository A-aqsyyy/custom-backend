import express from "express";
import pool from "./db.js";

const app = express();

app.use(express.json());


// Test route
app.get("/products", (req, res) => {
    res.send("Hello World");
});


// Create users table
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INTEGER
    )
`, (error, result) => {
    if (error) {
        console.log("Table creation failed", error);
    } else {
        console.log("Users table created successfully");
    }
});


// Database connection check
pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.log("Database failed to connect", error);
    } else {
        console.log("Database connected", result.rows);
    }
});


// Create user
app.post("/users", (req, res) => {

    const { name, email, age } = req.body || {};

    if (!name || !email) {
        return res.status(400).send("Name and email are required");
    }

    pool.query(
        `INSERT INTO users (name, email, age)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, email, age],
        (error, result) => {

            if (error) {
                console.log("User creation failed", error);
                return res.status(500).send("User creation failed");
            }

            res.json(result.rows[0]);
        }
    );

});


// Get all users
app.get("/users", (req, res) => {

    pool.query(
        "SELECT * FROM users",
        (error, result) => {

            if (error) {
                console.log("Failed to fetch users", error);
                return res.status(500).send("Failed to fetch users");
            }

            res.json(result.rows);
        }
    );

});


// Update user
app.put("/users/:id", (req, res) => {

    const userId = req.params.id;
    const { name, email, age } = req.body || {};

    if (!name || !email) {
        return res.status(400).send("Name and email are required");
    }

    pool.query(
        `UPDATE users
         SET name = $1, email = $2, age = $3
         WHERE id = $4
         RETURNING *`,
        [name, email, age, userId],
        (error, result) => {

            if (error) {
                console.log("User update failed", error);
                return res.status(500).send("User update failed");
            }

            if (result.rows.length === 0) {
                return res.status(404).send("User not found");
            }

            res.json(result.rows[0]);
        }
    );

});


// Delete user
app.delete("/delete-user/:id", (req, res) => {

    const userId = req.params.id;

    pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [userId],
        (error, result) => {

            if (error) {
                console.log("User deletion failed", error);
                return res.status(500).send("User deletion failed");
            }

            if (result.rows.length === 0) {
                return res.status(404).send("User not found");
            }

            res.json(result.rows[0]);
        }
    );

});


// Create project

app.post("/projects", (req, res) => {

    const { name, description, user_id } = req.body || {};

    if (!name || !user_id) {
        return res.status(400).send("Project name and user_id are required");
    }

    pool.query(
        `INSERT INTO projects (name, description, user_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, description, user_id],
        (error, result) => {

            if (error) {
                console.log("Project creation failed", error);

                if (error.code === "23503") {
                    return res.status(400).send("User does not exist");
                }

                return res.status(500).send("Project creation failed");
            }

            res.json(result.rows[0]);
        }
    );

});

// Get all projects
app.get("/projects", (req, res) => {

    pool.query(
        "SELECT * FROM projects",
        (error, result) => {

            if (error) {
                console.log("Failed to fetch projects", error);
                return res.status(500).send("Failed to fetch projects");
            }

            res.json(result.rows);
        }
    );

});


// Update project
app.put("/projects/:id", (req, res) => {

    const projectId = req.params.id;
    const { name, description, user_id } = req.body || {};

    pool.query(
        `UPDATE projects
         SET name = $1, description = $2, user_id = $3
         WHERE id = $4
         RETURNING *`,
        [name, description, user_id, projectId],
        (error, result) => {

            if (error) {
                console.log("Project update failed", error);
                return res.status(500).send("Project update failed");
            }

            if (result.rows.length === 0) {
                return res.status(404).send("Project not found");
            }

            res.json(result.rows[0]);
        }
    );

});


// Delete project
app.delete("/delete-project/:id", (req, res) => {

    const projectId = req.params.id;

    pool.query(
        "DELETE FROM projects WHERE id = $1 RETURNING *",
        [projectId],
        (error, result) => {

            if (error) {
                console.log("Project deletion failed", error);
                return res.status(500).send("Project deletion failed");
            }

            if (result.rows.length === 0) {
                return res.status(404).send("Project not found");
            }

            res.json(result.rows[0]);
        }
    );

});


// Get projects with user details
app.get("/projects/details", (req, res) => {

    pool.query(
        `SELECT
            projects.id AS project_id,
            projects.name AS project_name,
            projects.description,
            users.name AS user_name,
            users.email AS user_email
         FROM projects
         JOIN users
         ON projects.user_id = users.id`,
        (error, result) => {

            if (error) {
                console.log("Failed to fetch project details", error);
                return res.status(500).send("Failed to fetch project details");
            }

            res.json(result.rows);
        }
    );

});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});