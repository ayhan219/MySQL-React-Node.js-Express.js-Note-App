const express = require("express");
const app = express();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors")
const jwt = require("jsonwebtoken")

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
const jwtSecret = "30adea00811ca48e9ae741d3d029f0e8cae016530d311ab4411f73811a1e3c47";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ayhan551",
    database: "mydb"
});

// Signup route
app.post("/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the SQL query
        const q = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

        // Insert the new user into the database
        db.query(q, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "An error occurred while creating the account" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});

app.post("/auth/login",(req,res)=>{
    const {email,password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    const query = "select * from users where email = ?";

    db.query(query,[email],async(err,result)=>{
        if (err) return res.status(500).json({ error: "Database error", details: err });

        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
            
        const user = result[0];
        console.log(user.id);
        

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            jwtSecret,                          // Secret key
            { expiresIn: '1h' }                 // Token expiration time
        );

        res.json({ message: "Login successful", token ,user});
    })

})

app.post("/notes", (req, res) => {
    const { title, content, user_id } = req.body;

    if (!title || !content || !user_id) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    const query = "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)";
    db.query(query, [title, content, user_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred" });
        }
        res.status(201).json({ message: "Posted successfully" });
    });
});





app.get("/notes", (req, res) => {
    try {
        const { searchQuery } = req.query;

        // Base SQL query to get notes along with the user's name
        let query = `
            SELECT notes.id, notes.title, notes.content, users.username AS user_name
            FROM notes
            JOIN users ON notes.user_id = users.id
        `;

        // Add search filter if searchQuery is provided
        if (searchQuery) {
            query += ` WHERE notes.title LIKE ? OR notes.content LIKE ?`;
        }

        // Prepare query parameters
        const params = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`] : [];

        // Execute the query
        db.query(query, params, (err, result) => {
            if (err) return res.status(500).json({ error: "Database error", details: err });
            
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred", details: error });
    }
});


app.delete("/notes/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    // Ensure id is a number
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // Use parameterized query to prevent SQL injection
        const query = "DELETE FROM notes WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err); // Log the error
                return res.status(500).json({ error: "Database error", details: err });
            }

            // Check if any rows were affected
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Note not found" });
            }

            // Successfully deleted
            res.status(200).json({ message: "Note deleted successfully"});
        });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: "An error occurred", details: error });
    }
});

app.put("/notes/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const query = "UPDATE notes SET title = ?, content = ? WHERE id = ?";
        db.query(query, [title, content, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error", details: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Note not found" });
            }

            res.status(200).json({ message: "Note updated successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred", details: error });
    }
});


app.listen(5000, () => {
    console.log("Server listening on port 5000");
});
