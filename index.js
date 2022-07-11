const express = require("express")
const route = require('./Routes/routes')
const  mongoose = require("mongoose")
const app = express()
const port =process.env.PORT || 5000

//MIDDLEWARE
app.use(express.json());


mongoose.connect("mongodb+srv://Manisha:9831671085@manisha.t8nm5.mongodb.net/groupno49",{
    useNewUrlParser : true
})

.then(()=>console.log("connected"))
.catch(err=> console.log("not connrected"));

app.use('/', route)

app.listen(port,  () => {
    console.log(`Example app listening on port ${port}!`);
})
