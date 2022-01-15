const mongoose  = require("mongoose");


const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.BD_CNN );

        console.log('BD en línea')
        
    } catch (error) {
        console.log(error);
        throw new Error('Error conectando a la base de datos');
    }

}

module.exports = {
    dbConnection
}