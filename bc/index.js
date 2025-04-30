import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import User from './models/user.model.js'
import mongoose from 'mongoose'

dotenv.config({})

const app = express()
const PORT = process.env.PORT
// app.use(express.json())
// app.use(cookieParser())

// app.use('/api/auth', authRoutes)

// const test = User.findOne({ email: 'lynx@example.com'})
//     .then(user => {
//         if (user) {
//             console.log(test)
//             console.log('User found:', user)
//         } else {
//             console.log('User not found')
//         }
//     })
//     .catch(err => {
//         console.error('Error finding user:', err)
//     })

const test = async () => {
    const findUser = await User.findOne({ email: 'lynx@example.com' })
    console.log(findUser._id)
}



app.use('/api/:id',async (req, res) => {
    const { id } = req.params
    const findUser = await User.findById(id)
    if (findUser) {
        const { _id, name, email, password}= findUser
        res.status(200).json({  _id, name, email, password })
    } else {
        res.status(404).json({ message: 'User not found' })
    }
})

const name = {
    firstname: 'Lynx',
    "lastname": 'ninja'
}
console.log(name.firstname, name.lastname)

app.use('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API' })
})
// console.log(test)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})