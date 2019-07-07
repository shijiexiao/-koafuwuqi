const Koa = require('koa')
const wechat=require('./wechat-lib/middleware')
 const config=require('./config/config')
const {reply}=require('./wechat/reply')
const {initSchemas ,connect} =require('./app/database/init')
//shengcheng fuwuqi shili
;
(async ()=>{
    await connect(config.db)
    initSchemas()
   // 这是 token数据库存储
 const {WechatClientClassAndDb} =require('./wechat/index')

  await  WechatClientClassAndDb()
    const app = new Koa();
  app.use(wechat(config.wechat,reply))

    app.listen(config.port)
    console.log('listen'+config.port);

})()





