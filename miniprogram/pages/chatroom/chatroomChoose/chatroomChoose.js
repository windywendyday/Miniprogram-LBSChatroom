// pages/chatroom/chatroomChoose/chatroomChoose.js
const dbUser = wx.cloud.database().collection('userInfo')
const dbChatroom = wx.cloud.database().collection('chatroom')  
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        schoolID:'',
        isAuthorized:false,
        roomID:'',
        curLatitude:'',
        curLongitude:'',
        chatroomName:'',
        chatroomCover:'',
        chatroomList:[],
        minlat:'',
        minlng:'',
        maxlat:'',
        maxlng:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // wx.getSetting({
        //     success:(res)=>{
        //         if (!res.authSetting['scope.userLocation']) {
        //             wx.authorize({
        //               scope: 'scope.userLocation',
        //               success () {
        //                 console.log('用户已授权', this.scope)
        //                 // 用户已经同意小程序使用位置获取功能，后续调用接口不会弹窗询问
        //               },
        //               fail(error){
        //                   console.log(error)
        //               }
        //             })
        //         }
        //     }})
        let profile = JSON.parse(wx.getStorageSync('userProfile'));
        this.setData({
            schoolID: profile.data[0].schoolID
        })
    },

    //获取当前位置
    getCurrentLocation(){
        dbUser.where({
            schoolID:this.data.schoolID
        }).get({
            success: res => {
                this.setData({
                    curLongitude:res.data[0].curLongitude,
                    curLatitude:res.data[0].curLatitude
                })
                console.log(this.data.curLongitude,this.data.curLatitude)
            },fail: () => {
                wx.showToast({
                    title:'当前位置获取失败'
                })
            }
        })
        const { minlat, minlng, maxlat, maxlng } = this.getMaxMinLongitudeLatitude(this.data.curLongitude, this.data.curLatitude, 0.2)
        this.setData({
            minlat: minlat,
            minlng: minlng,
            maxlat: maxlat,
            maxlng: maxlng
        })
    },

    //获取附近的聊天室
    getChatroom(){
        dbChatroom.where({
            latitude: _.in(this.minlat, this.maxlat),
            longitude: _.in(this.minlng, this.maxlng),
        }).get({
            success(res){
                // chatroomList = res.data.chatroomList
                console.log(res.data)
            },
            fail(error){
                console.log(error)
            }
        })
    },

    //根据距离计算经纬度范围
    getMaxMinLongitudeLatitude(curLongitude, curLatitude, distance){
        let r = 6371.393;    // 地球半径千米
        let dlng = 2 * Math.asin(Math.sin(distance / (2 * r)) / Math.cos(curLatitude * Math.PI / 180));
        dlng = dlng * 180 / Math.PI;// 角度转为弧度
        let dlat = distance / r;
        dlat = dlat * 180 / Math.PI;
        let minlat = curLatitude - dlat;
        let maxlat = curLatitude + dlat;
        let minlng = curLongitude - dlng;
        let maxlng = curLongitude + dlng;
        const lngLatObj={
            minlng:minlng,
            maxlng:maxlng,
            minlat:minlat,
            maxlat:maxlat
        }
        return lngLatObj;
    },

    toRoomDetail(){
        wx.navigateTo({
            url:'/pages/chatroom/chatroomDetail/chatroomDetail',
            // +this.data.chatroomId+this.data.schoolID,
            success:function(res){
                res.eventChannel.emit('getUserInfo',
                { 
                    schoolID:this.schoolID, 
                    roomID:this.roomID
                })
            }
        })
    },

    //选择聊天室
    // chooseChatroom(){
    //     this.toRoomDetail()

    // },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // dbChatroom.where()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getCurrentLocation()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },
})