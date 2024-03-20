// pages/chatroom/chatroom.js
const dbWatcher = wx.cloud.database().collection('chatroom')
// const ws = require('nodejs-websocket')
// ws.createServer(connection => {
//     console.log('建立新的链接')
//     connection.on('text',function(data){
//         console.log('接收到的消息：' + data)
//     })
// })
// const { socketTask } = await wx.cloud.connectContainer({
//     config: {
//       env: '', // 替换自己的微信云托管的环境ID
//     },
//     service: 'ws', // 替换自己的服务名
//     path: '/' // 不填默认根目录
// })
  
Page({
    /**
     * 页面的初始数据
     */
    data: {
        condition:true,
        schoolId:'',
        avatar:'',
        conversations:[],
        message:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideTabBar()
        wx.connectSocket({
          url: 'url',
        })
    },
    // showKeyboard(){
    //     wx.showKeyboard()
    // },
    showMoreMenu(){
        console.log('调用函数');
        if(this.data.condition){
            this.setData({
                condition:false
            })
        }
       else {
            this.setData({
                condition:true
            })
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    // getConversationsItem(item) {
    //     let {latestMsg, ...msg} = item;
    //     return Object.assign(msg, JSON.parse(latestMsg));
    // }

})