const mongoose = require('mongoose');

const db = ()=>{
    mongoose.connect(process.env.MONGO_URI, ).then(()=>{
        console.log('MONGO DB Connection - Successs')
    }).catch((err)=>{
        console.log(err)
        throw new Error('Hata aldık moruk while DB Connection.')
    })
}

module.exports = db