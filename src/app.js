let express = require('express')
let pm = require('./productManager')

const app = express()

app.use(express.urlencoded({extended: true}))




app.listen(8080,()  => {
    console.log('Server is running on port 8080, http://localhost:8080/')
})