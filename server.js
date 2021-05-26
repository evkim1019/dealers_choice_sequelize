const express = require('express');
const path = require('path');

const app = express();
const { syncAndSeed, Brewery, Location } = require('./db');
syncAndSeed();

app.use(express.urlencoded({extended: false}));

app.post('/brewery', async ( req, res, next ) => {
  await Brewery.create({ name: req.body.breweryName });
  await Location.create({ borough: req.body.locationBorough });
  res.redirect('/')
})


app.get('/breweries', async (req, res, next) => {
   try {
    const [ brewery, location ] = 
    await Promise.all([
      Brewery.findAll({
        include: { all: true }
      })
    ]);
    res.send(brewery)
   }
   catch(err){
     next(err)
   }
})



const init = async () => {
  const port = 8080;
  app.listen(port, console.log(`Listening on port ${port}`))
}

init();