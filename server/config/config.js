//******************************
//          Puerto
//******************************
process.env.PORT = process.env.PORT || 3000;

//******************************
// *** Entorno ***//
//******************************
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//******************************
//      Vencimiento token
//******************************
process.env.CADUCIDAD_TOKEN = '48h';

//******************************
//      Seed token
//******************************
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//******************************
//      Base de datos
//******************************
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    //BD local
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    //BD nube
    urlDB = process.env.MONGO_URI;
}

//******************************
//      Google Client ID
//******************************
process.env.CLIENT_ID = process.env.CLIENT_ID || '698823280782-frvnir48ck6evgvq8rldhqb3a2nd6g3r.apps.googleusercontent.com';

process.env.URLDB = urlDB;