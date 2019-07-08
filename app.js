const Koa = require('koa')
const Router=require('koa-router')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const {resolve} =require('path')
const moment=require('moment')
const {reply} = require('./wechat/reply')
const {initSchemas, connect} = require('./app/database/init')
//shengcheng fuwuqi shili
;
(async () => {
    await connect(config.db)
    initSchemas()
    // 这是 token数据库存储

    const app = new Koa();
    const router=new Router()


    const views=require('koa-views')
    app.use(views(resolve(__dirname+'/app/views'),{
        extension:'pug',
        options:{
            moment:moment
        }
    }))



    //接入微信消息中间件

    require('./config/routes')(router)

    app.use(router.routes()).use(router.allowedMethods())


    app.listen(config.port)
    console.log('listen' + config.port);

})()





