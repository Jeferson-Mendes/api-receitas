const mongoose = require('mongoose');

const init = () => {
    mongoose.connect( process.env.MONGO_URI || 'mongodb://localhost/api_receitas', {
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
}

module.exports = { init };