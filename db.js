const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/nyc_brewery_db', { logging: false });
const { STRING } = Sequelize;

const Brewery = conn.define('brewery', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  }
})
const Location = conn.define('location', {
  borough: {
    type: STRING,
    allowNull: false,
    unique: true
  }
})

Brewery.belongsTo(Brewery, {as: 'sisterBrewery'})
Brewery.belongsTo(Location)
Location.hasMany(Brewery)

const data = {
  breweries: [ {name: 'Gunhill Brewery', locationId: 1}, {name: 'Grimm Artisanal', sisterBreweryId: 1, locationId: 2}, {name:'Interboro', sisterBreweryId: 2, locationId: 2}, { name: 'Mikkeller', locationId: 3}],
  locations: [ 'Bronx', 'Brooklyn', 'Queens' ],
}

const syncAndSeed =  async () => {
  await conn.sync( { force: true } );
  await data.locations.map(d => Location.create( {borough: d} ));
  await data.breweries.map(d => Brewery.create( d ));
}

module.exports = {
  syncAndSeed,
  Brewery,
  Location
}