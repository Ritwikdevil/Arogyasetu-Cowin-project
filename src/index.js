const express = require('express');
const route = require('./routes/route.js');
const mongoose = require('mongoose')

const app = express();

app.use(express.json());
mongoose.set('strictQuery', false)


mongoose.connect("mongodb+srv://ritwikmukherjee:PWq0SUWHb3HfskHy@cluster0.tzjat9y.mongodb.net/RUNO", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, () => {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});