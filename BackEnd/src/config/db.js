const mongoose = require("mongoose");

const connectDB = async function(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected successfully");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;