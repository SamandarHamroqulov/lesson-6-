const { default: mongoose } = require("mongoose");
const { globalError } = require("shokhijakhon-error-handler");

async function dbConnection(req, res) {
    try {
        
        mongoose.connect(process.env.DB_URI)
        console.log("DB succesfully connected");
        

    } catch (err) {
        console.log("Failed to connect");
        return globalError(err, res)
        
        
    }
}
module.exports = dbConnection