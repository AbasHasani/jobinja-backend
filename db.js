const mongoose = require("mongoose");

module.exports = async function() {
    try {
        const connectionParams = {
            // userNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(process.env.DB_CONNECT, connectionParams);
        console.log("Connected to the database");
    } catch (err) {
        console.log(err);
        console.log("ERRROR HGAPPENED AGAIN###@#@@@@@");
    }
}