// pages/chatroom/chatroom.js
const db = wx.cloud.database().collection('conversations')
var socketTask

Page({
    /**
     * 页面的初始数据
     */
    data: {
        condition:true,
        schoolID:'',
        avatar:'',
        conversations:[],
        value:'',
        message:'',
        isBlur: false,
        roomID:'',
        height:1300,
        toView:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {  
        let that = this
        this.getOpenerEventChannel().once('getUserInfo', ({schoolID, roomID}) => {
            console.log('传过来的ID为', roomID)
            this.setData({
                schoolID: schoolID,
                roomID: roomID,
            })
            db.where({
                roomID: roomID
            })
            .get({
                success:function(res){
                    console.log(res.data)
                    that.setData({
                        conversations: res.data,
                        toView:`item${res.data.length - 1}`
                    })
                }
            })
        }
        ),

        ( { socketTask } = await wx.cloud.connectContainer({
            config: {
            env: 'prod-6gqde8rzdaa25908', // 替换自己的微信云托管的环境ID
            },
            service: 'lbschatroom', // 替换自己的服务名
            path: '/' // 不填默认根目录
        }))
        
        // console.log(socketTask)
        socketTask.onMessage(function (res) {
            const messageItem = JSON.parse(res.data)
            console.log('【WEBSOCKET】', messageItem)
            if(messageItem.roomID){
                db.add({
                    data:{
                        from: messageItem.from,
                        message: messageItem.message,
                        timestamp:messageItem.timestamp,
                        roomID:messageItem.roomID
                    }
                })
                that.data.conversations.push(messageItem)
                that.setData({
                    conversations: that.data.conversations,
                    toView:`item${that.data.conversations.length - 1}`
                })
                if(messageItem.from === that.data.schoolID){
                    that.setData({
                        isUser: true
                    })
                }
            }
        })
        socketTask.onOpen(function (res) {
            console.log('【WEBSOCKET】', '链接成功！')
        })
        socketTask.onClose(function (res) {
            console.log('【WEBSOCKET】链接关闭！', res)
        })   
        wx.hideTabBar()
        //在底部
        
    },
    handleInput(){
    },
    handleScroll(e){
        // console.log(e)
    },
    handleBlur(){
        // console.log(this.data.conversations)
    },
    handleConfirm(e){
        this.setData({
            message:e.detail.value,
            value:'',
        })
        console.log(this.data.message)
        const sendMessageItem = {
            from: this.data.schoolID,
            message: this.data.message,
            timestamp: new Date().getTime(),
            roomID: this.data.roomID
        }
        socketTask.send({
            data: JSON.stringify(sendMessageItem)
        })
        console.log('发送成功')
        // db.add({
        //     data:{
        //         from: that.data.schoolID,
        //         message: that.data.message,
        //         timestamp: new Date().getTime(),
        //         roomID: that.data.roomID
        //     },
        //     success(){
                
        //     }
        // })
        
    },
    showMoreMenu(){
        if(this.data.condition){
            console.log('打开了更多菜单')
            this.setData({
                condition:false,
                height:900
            })
            this.setData({
                toView:`item${this.data.conversations.length - 1}`
            })
        }
       else {
            this.setData({
                condition:true,
                height:1300,
                toView:`item${this.data.conversations.length - 1}`
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
    
    onUnload(){
    }

})