// //  Puerto
process.env.PORT = process.env.PORT || 3000;

// *** Entorno ***//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    //BD local
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    //BD nube
    urlDB = process.env.MONGO_URI;
}

// urlDB = 'mongodb+srv://lunina:jUf2ae3aYLqSnaE9@cluster0-qjv8d.mongodb.net/cafe';
console.log('Bd: ', urlDB);
process.env.URLDB = urlDB;