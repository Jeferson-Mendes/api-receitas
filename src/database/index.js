const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/api_receitas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(()=> {
    console.log('Has been connected')
})
.catch(e => {
    console.log('There is a Error ', e)
})

module.exports = mongoose;