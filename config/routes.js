const Wechats=require('../app/controller/wechat')


module.exports= (router) =>{
    router.get('/sdk',Wechats.sdk)
    router.get('/wx-hear',Wechats.hear)
    router.post('/wx-hear',Wechats.hear)

    //调到授权中间服务页面
    router.get('/wx-oauth',Wechats.oauth)

    router.get('/userinfo',Wechats.userinfo)

}