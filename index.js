import cors from 'cors'
import express from 'express'
import router from './router.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

app.listen(4000, () => {
    console.log('ON!')
})