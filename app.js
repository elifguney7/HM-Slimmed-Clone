const express = require('express'); 

const app = express(); 
const mysql = require('mysql');
const port = 3000;
const ejs = require('ejs'); // Require EJS

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static('public')); 

const connection = mysql.createConnection({
    host: 'elifguneyhmclone.mysql.database.azure.com',
    user: 'elifguney',
    password: 'test123.',
    database: 'my_database'
});



// Event: Connection Established
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Home Page route
app.get('/', (req, res) => {
    const query = 'SELECT id, name, price, img_url FROM products WHERE status = "new" LIMIT 16';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching new products:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Render the 'home' view (home.ejs) with the retrieved product data
        res.render('home', { products: results });
    });
});

// Search Page route
app.get('/search', (req, res) => {
    const searchText = req.query.q; // Get the search query from the request
    const categoryQuery = 'SELECT category, COUNT(*) AS count FROM products GROUP BY category'; // Query to get categories and their counts
    const searchQuery = `SELECT id, name, price, size, category, img_url FROM products WHERE name LIKE '%${searchText}%' ORDER BY price ASC`; // Query to get search results

    connection.query(categoryQuery, (err, categories) => {
        if (err) {
            console.error("Error fetching categories:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        connection.query(searchQuery, (err, results) => {
            if (err) {
                console.error("Error fetching search results:", err);
                res.status(500).send("Internal Server Error");
                return;
            }

            // Render the 'search' view with the retrieved categories, search results, and searchText
            res.render('search', { categories, results, searchText });
        });
    });
});

app.get('/detail/:productId', (req, res) => {
    const productId = req.params.productId; // Get the product ID from the request parameters
    
    // Query to retrieve product details based on the product ID
    const query = `SELECT id, name, price, description, img_url, category, size FROM products WHERE id = ${productId}`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching product details:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        if (results.length === 0) {
            // If no product found with the given ID, render an error page or redirect to the home page
            res.status(404).send("Product not found");
            return;
        }

        const product = results[0]; // Retrieve the first (and only) product from the results
        // Render the 'detail' view with the retrieved product details
        res.render('detail', { product });
    });
});


app.listen(port, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ port) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
); 