// ===================================
process.env.PORT = process.env.PORT || 3000;

// ===================================
// Entonrno
// ===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================================
// Base de datos
// ===================================

let urlDB;
if ( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB =  'mongodb+srv://bastion:1eaPY8LaACIbFiz5@cluster0.mvror.mongodb.net/cafe'
}

process.env.URLDB = urlDB;