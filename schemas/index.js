const mongoose = require("mongoose");

const connect = () => {
    mongoose
        // .connect("mongodb://localhost:27017/voyage_blog") //local
        .connect("mongodb+srv://revido:mymongodb@cluster0.5iwafmj.mongodb.net/voyageblog?retryWrites=true&w=majority") //server
        .catch(err=>console.log(err))
}

mongoose.connection.on('error', err=> {
    console.error('MongoDB connection error', err);
})

module.exports = connect;