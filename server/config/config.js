//  Puerto
process.env.PORT = process.env.PORT || 3000;

// *** Entorno ***//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    //BD local
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    //BD nube
    urlDB = 'mongodb+srv://lunina:grZNskfQL1Bxf1aw@cluster0-qjv8d.mongodb.net/cafe';
}

process.env.URLDB = urlDB;