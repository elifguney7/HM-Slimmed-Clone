const express = require('express'); 

const app = express(); 
const mysql = require('mysql');
const PORT = 3000; 
const ejs = require('ejs'); // Require EJS

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static('public')); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test123',
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
app.get('/', (req, res) => {
    const query = 'SELECT id, name, price, img_url FROM products WHERE is_new = 1 LIMIT 16';

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

// app.get('/', (req, res) => {
//     const query = 'SELECT id, name, price, img_url FROM products WHERE is_new = 1 LIMIT 16';

//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error("Error fetching new products:", err);
//             res.status(500).send("Internal Server Error");
//             return;
//         }
//         else{
//             console.log(results)
//         }
//     })
// 	res.sendFile(__dirname + '/home.html') 
//   }) 

app.listen(PORT, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
); 

