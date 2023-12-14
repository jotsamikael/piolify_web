import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongodb/dbConnection.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js'


const app = express();
dotenv.config();
app.use(cors())
app.use(express.json('50mb')) //specify the size limit of files send from the frontend
app.get('/', (req, res) => {
    res.send({ message: "HOUREZ Ltd version 1.0" })
})

app.use('/api/v1/user', userRouter);
app.use('/api/v1/property', propertyRouter);



const startServer = async () => {
    try {
        //connect to database
        connectDB(process.env.MONGODB_URL);
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server running on http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        //catch any error
        console.log(error)
    }
}

startServer();