// database/connectDB.js
import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("Intentando conectar a la base de datos:");
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB conectada exitosamente');
    } catch (error) {
        console.log("Error en la conexión a la base de datos:", error);
    }
};

export default connectDb;


