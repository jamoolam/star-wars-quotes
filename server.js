const express = require('express')
const app = express()
//Turns out, Express doesn’t handle reading data from the <form> element on it’s own. We have to add another package called body-parser to gain this functionality.
const bodyParser = require('body-parser')
//we can connect to MongoDB through the MongoClient’s connect method
const MongoClient = require('mongodb').MongoClient
let connectionString = 'mongodb+srv://jamalmizyed08:Jamoola0801@cluster0.2oxwayd.mongodb.net/?retryWrites=true&w=majority'

//MongoDB supports promises, so this code uses promises instead of callbacks
MongoClient.connect(connectionString)
  .then(client => {
    console.log('Connected to Database')

    //We need to change the database from test to something else. You can name it anything you want. I chose to name my new database star-wars-quotes because it helps me remember what I’m building.
    const db = client.db('star-wars-quotes')

    //We need to create a collection before we can store items into a database. Like Databases, you can name collections anything you want. In this case, let’s store quotes into a quotes collection. We use db.collection to specify the collection.
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')

    //Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))

    //We create an external JavaScript file to execute a PUT request. According to Express conventions, this JavaScript is kept in a folder called public
    app.use(express.static('public'))

    //Our server doesn’t accept JSON data yet. We can teach it to read JSON by adding the body-parser’s json middleware.
    app.use(bodyParser.json())

    //endpoint is the requested endpoint. It’s the value that comes after your domain name. the callback function tells the server what to do when the requested endpoint matches the endpoint stated. 
    app.get('/', (req, res) => {
        //We can get quotes we stored in MongoDB with the find method. This method from mLab by using the find method that’s available in the collection method. this cursor object contains all quotes from our database! It has a bunch of method that lets us get our data. For example, we can use toArray to convert the data into an array.
        db.collection('quotes')
            .find()
            .toArray()
            .then(results => {
                //lets put the quotes into index.ejs => to do this, we need to pass the quotes into the render method
                res.render('index.ejs', { quotes: results})
            })
            .catch(error => console.error(error))
    })

    //We can handle this POST request with a post method in server.js. The path path should be the value you placed in the action attribute.
    app.post('/quotes', (req, res) => {
        quotesCollection
            .insertOne(req.body)
            .then(result => {
                //redirects browser to main page after saving to collection
                res.redirect('/')
            })
            .catch(error => console.error(error))
        //The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.
    })

    //Next, we can handle the PUT request with a put method. You should be able to see the values we send from the fetch request.
    app.put('/quotes', (req, res) => {
        quotesCollection
            .findOneAndUpdate(//query, update, options
            /*query lets us filter the collection with key-value pairs. If we want to filter quotes to those written by Yoda, we can set { name: 'Yoda' } as the query. update, tells MongoDB what to change. It uses MongoDB’s update operators like $set, $inc and $push. We will use the $set operator since we’re changing Yoda’s quotes into Darth Vader’s quotes.options tells MongoDB to define additional options for this update request. In this case, it’s possible that no Yoda quotes exist in the database. We can force MongoDB to create a new Darth Vader quote if no Yoda quotes exist. We do this by setting upsert to true. upsert means: Insert a document if no documents can be updated.*/
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote,
                    },
                },
                {
                    upsert: true,
                }
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
    })

    //We can handle the delete event on our server with the delete method
    app.delete('/quotes', (req, res) => {
       //MongoDB Collections has a method called deleteOne. It lets us remove a document from the database. It takes in two parameters: query and options.
       quotesCollection
       //query works like query in findOneAndUpdate. It lets us filter the collection to the entries we’re searching for. However, since we already pass the name Darth Vader from Fetch, we don’t need to hardcode it in Express anymore. We can simply use req.body.name.In this case, we don’t need to change any options, so we can omit options.
        .deleteOne({ name: req.body.name}) //query, options
        .then(result => {
            //What if there are no more Darth Vader quotes...
            //If there are no more Darth Vader quotes, result.deletedCount will be 0. We can send a message that tells the browser that there are no more Darth Vader quotes to delete.
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vader's quote`)
          })
          .catch(error => console.error(error))
      })

    //We need to create a server that browsers can connect to. We do this by using the Express’s listen method.
    app.listen(3000, function () {
        console.log('listening on 3000')
    })

  })
  .catch(error => console.error(error))







