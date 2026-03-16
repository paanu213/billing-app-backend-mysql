const express = require('express')
const dotEnv = require('dotenv')
const cors = require('cors')

//importing - require routes
//const serviceRoutes = require('./routes/serviceRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const authRoutes = require('./routes/auth.routes')
const companiesRoutes = require('./routes/company.routes')

dotEnv.config()

const app = express();

const PORT = process.env.PORT || 5000;


app.use(express.json())
app.use(cors())


//app.use('/services', serviceRoutes)
app.use('/invoices', invoiceRoutes)
app.use('/auth', authRoutes )
app.use('/companies', companiesRoutes )



app.listen(PORT, ()=>{
    console.log(`this app is running on port: ${PORT}`)
})