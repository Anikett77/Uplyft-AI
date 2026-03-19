import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI,);
        const connection = mongoose.connection;

        connection.on('connected',() => {
            console.log('MongoDB connected sucessfully');
        })

        connection.on('error', (err) => {
            console.log('mongodb connection error, please make sure db is running' + err);
            process.exit();
        })
    } catch (error) {
        console.log('something went wrong');
        console.log(error)
        
    }
    
}