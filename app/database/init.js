const mongoose = require('mongoose')
const {resolve} = require('path')
const glob=require('glob')
mongoose.Promise=global.Promise
exports.initSchemas = () => {
    //吧所有文件读取寄来
    glob.sync(resolve(__dirname,'./schema','**/*.js'))
        .forEach(require)
}



exports.connect = (db) => {
    return new Promise((resolve) => {
        mongoose.connect(db)
        mongoose.connection.on('disconnect', () => {
            console.log('数据库没连接吧杰哥');

        })
        mongoose.connection.on('error', err => {
            console.log(err);
        })
        mongoose.connection.on('open', () => {
            resolve()
            console.log('mongodb connected');
            var schema = new mongoose.Schema({
                username:"string",
                password:"number"
            });
            var Model = mongoose.model('Model', schema);
            var doc1 = new Model({
                username:"admin",
                password:123456
            });
            console.log(doc1)
            doc1.save();
            console.log('mongodb saved');


        })
    })
}