const {resolve} = require('path')

exports.reply = async (ctx, next) => {
    const message = ctx.weixin
    let mp = require('./index')
    let client = mp.getWechat()

    console.log(message);
    //yu ying wenben
    if (message.MsgType === 'event') {
        let reply = ''
        if (message.Event === 'LOCATION') {
            reply = `您上报的位置是:${message.Latitude}--${message.Longitude}--${message.Precision}`

        }
        ctx.body = reply;
    } else if (message.MsgType === 'text') {
        let content = message.Content;
        let reply = 'oH 你说的···' + content + '···太复杂了，我作为杰哥的机器人都听不懂'
        //moren de huifu neirong
        if (content === '1') {
            reply = '天下第一杰哥'
        } else if (content === '2') {
            reply = '杰哥帅气'
        } else if (content === '3') {
            reply = '我最爱杰哥了'
        } else if (content === '4') {
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'))
            reply = {
                type: 'image', mediaId: data.media_id
            }
        }
        else if (content === '5') {
            let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'))
            reply = {
                type: 'video'
                , title: '回复的视频标题叫杰哥'
                , description: '唱跳rap cxk',
                mediaId: data.media_id
            }
        } else if (content === '6') {
            let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'), {
                type: 'video',
                description: '{"title": "这个地方很棒", "introduction": "好吃不如饺子"}'
            })

            reply = {
                type: 'video',
                title: ' 2 第二个video',
                description: '打个篮球玩玩',
                mediaId: data.media_id
            }
        } else if (content === '7') {
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
                type: 'image'
            })

            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        } else if (content === '8') {
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
                type: 'image'
            })
            let data2 = await client.handle('uploadMaterial', 'pic', resolve(__dirname, '../2.jpg'), {
                type: 'image'
            })
            console.log(data2)

            let media = {
                articles: [
                    {
                        title: '这是服务端上传的图文 1',
                        thumb_media_id: data.media_id,
                        author: '肖是杰',
                        digest: '没有摘要',
                        show_cover_pic: 1,
                        content: '点击去往慕课网',
                        content_source_url: 'http://coding.imooc.com/'
                    }, {
                        title: '这是服务端上传的图文 2',
                        thumb_media_id: data.media_id,
                        author: 'Scott',
                        digest: '没有摘要',
                        show_cover_pic: 1,
                        content: '点击去往 github',
                        content_source_url: 'http://github.com/'
                    }
                ]
            }

            let uploadData = await client.handle('uploadMaterial', 'news', media, {})

            let newMedia = {
                media_id: uploadData.media_id,
                index: 0,
                articles: {
                    title: '这是服务端上传的图文 1',
                    thumb_media_id: data.media_id,
                    author: 'Scott',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '点击去往慕课网',
                    content_source_url: 'http://coding.imooc.com/'
                }
            }

            console.log(uploadData)

            let mediaData = await client.handle('updateMaterial', uploadData.media_id, newMedia)

            console.log(mediaData)

            let newsData = await client.handle('fetchMaterial', uploadData.media_id, 'news', true)
            let items = newsData.news_item
            let news = []

            items.forEach(item => {
                news.push({
                    title: item.title,
                    description: item.description,
                    picUrl: data2.url,
                    url: item.url
                })
            })

            reply = news
        } else if (content === '9') {
            let counts = await client.handle('countMaterial')
            console.log(JSON.stringify(counts))

            let res = await Promise.all([
                client.handle('batchMaterial', {
                    type: 'image',
                    offset: 0,
                    count: 10
                }),
                client.handle('batchMaterial', {
                    type: 'video',
                    offset: 0,
                    count: 10
                }),
                client.handle('batchMaterial', {
                    type: 'voice',
                    offset: 0,
                    count: 10
                }),
                client.handle('batchMaterial', {
                    type: 'news',
                    offset: 0,
                    count: 10
                })
            ])

            console.log(res)

            reply = `
        image: ${res[0].total_count}
        video: ${res[1].total_count}
        voice: ${res[2].total_count}
        news: ${res[3].total_count}
      `
        } else if (content === '10') {
            // 创建标签
            // let newTag = await client.handle('createTag', 'imooc')
            // console.log(newTag)
            // 删除标签
            // await client.handle('delTag', 100)
            // 编辑标签
            // await client.handle('updateTag', 101, '慕课网')
            // 批量打标签/取消标签
            await client.handle('batchTag', [message.FromUserName], 101, true)
            // 获取某个标签的用户列表
            let userList = await client.handle('fetchTagUsers', 2)
            console.log(userList)
            // 获取公众号的标签列表
            let tagsData = await client.handle('fetchTags')
            // 获取某个用户的标签列表
            // let userTags = await client.handle('getUserTags', message.FromUserName)

            reply = tagsData.tags.length
        } else if (content === '11') {
            let userList = await client.handle('fetchUserList')

            console.log(userList)

            reply = userList.total + ' 个关注者'
        } else if (content === '12') {
            await client.handle('remarkUser', message.FromUserName, '杰哥杰哥我爱你名字')
            reply = '改名成功'
        } else if (content === '13') {
            let userInfoData = await client.handle('getUserInfo', message.FromUserName)

            console.log(userInfoData)

            reply = JSON.stringify(userInfoData)
        } else if (content === '14') {
            let batchUsersInfo = await client.handle('fetchBatchUsers', [{
                openid: message.FromUserName,
                lang: 'zh_CN'
            }])

            console.log(batchUsersInfo)

            reply = JSON.stringify(batchUsersInfo)
        }
        else if (content === '15') {

            // let tempQrData={
            //     expires_seconds:4000000,
            //     action_name:'QR_SCENE',
            //     action_info:{
            //         scene:{
            //             scene_id:101
            //         }
            //     }
            //
            // }
            //
            // let tempTicketData=await client.handle('createQrcode',tempQrData)
            //
            // let temQr=await client.showQrcode(
            //     tempTicketData.ticket)
            let qrData = {
                action_name: 'QR_SCENE',
                action_info: {
                    scene: {
                        scene_id: 99
                    }
                }

            }

            let ticketData = await client.handle('createQrcode', qrData)

            let qr = await client.showQrcode(
                ticketData.ticket)


            console.log(qr);
            reply = qr;
        } else if (content === '16') {
            let longurl = 'https://search.bilibili.com/all?keyword=%E9%80%92%E5%BD%92';

            let shortData = await client.handle('createShortUrl', 'long2short', longurl)
            console.log(shortData);
            reply = shortData.short_url;

        } else if (content === '17') {
            let semanticData = {
                query: '查一下明天从杭州到北京的南航机票',
                city: '杭州',
                category: 'flight,hotel',
                uid: message.FromUserName
            }
            let searchData = await client.handle('semantic', semanticData)

            console.log(searchData)

            reply = JSON.stringify(searchData)
        } else if (content === '18') {
            let body = '三端分离架构，手撸代码';
            let aiData = await client.handle('aiTranslate', body, 'zh_CN', 'en_US')
            console.log(aiData);

            reply =aiData.to_content;
        }


        ctx.body = reply

    }

    await  next()
}