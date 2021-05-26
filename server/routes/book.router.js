const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
// router.put('/:id', (req, res) => {
//   const songId = req.params.id;

//   // Change the rank of the song by the user ...
//   // expected values = 'up' OR 'down';
//   let direction = req.body.direction;

//   let queryString = '';

//   if (direction === 'up') {
//       queryString = 'UPDATE "songs" SET "rank"=rank-1 WHERE "songs".id = $1;';
//   } else if(direction === 'down') {
//       queryString = 'UPDATE "songs" SET "rank"=rank+1 WHERE "songs".id = $1;';
//   } else {
//       // If the direction is somehow not what we expect, we reject the response and send
//       // back a 500 error.
//       res.sendStatus(500);
//       return; // early exit since it's an error!
//   }

//   pool.query(queryString, [songId])
//       .then(response => {
//           console.log(response.rowCount);
//           res.sendStatus(202);
//       })
//       .catch(err => {
//           console.log('This is frustrating.', err);
//           res.sendStatus(500);
//       });
// })

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id



router.delete('/:id', (req, res) => {
  // grab the id of the record to delete from the request params ...
  const itemToDelete = req.params.id;
  const queryString = `DELETE FROM "books" WHERE "books".id = $1;`;
  pool.query(queryString, [itemToDelete])
      // don't need parens around single argument for arrow function ...
      // same as .then((response) => {});
      .then(response => {
          console.log(`We deleted book with id ${itemToDelete}.`);
          // res.send('Ding dong the witch is dead!').sendStatus(200);
          res.sendStatus(200);
      })
      .catch(err => { // MUST have a catch for promises ...
          console.log('You done messed up, A-A-Ron!', err);
          res.sendStatus(500); // Always send a 500 for an error in the process.
      });
});


module.exports = router;
