// pages/chatroom/chatroomChoose/chatroomChoose.js
const app = getApp()
const dbUser = wx.cloud.database().collection('userInfo')
  
Page({
    /**
     * 页面的初始数据
     */
    data: {
        schoolID:'M202375536',
        isAuthorized:false,
        roomID:'1',
        curLatitude:'',
        curLongitude:'',
        chatroomName:'',
        chatroomCover:'',
        chatroomList:[],
        minlat:'',
        minlng:'',
        maxlat:'',
        maxlng:'',
        searchPosition:'',
        isChooseManually: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let profile = JSON.parse(wx.getStorageSync('userProfile'));
        this.setData({
            schoolID: profile.data[0].schoolID
        })
    },

    //获取当前位置
    firstGetCurrentLocation(){
        let that = this
        if(!that.data.isChooseManually){
            wx.getLocation({
                type: 'wgs84',
                success(res){
                    that.setData({
                        curLongitude:res.longitude,
                        curLatitude:res.latitude
                    })
                    console.log('自动定位获取的地址为', that.data.curLatitude, that.data.curLongitude)
                },
                fail(){
                    console.log('调用getLocation获取地理位置失败')
                    dbUser.where({
                        schoolID:that.data.schoolID
                    }).get({
                        success: res => {
                            that.setData({
                                curLongitude:res.data[0].curLongitude,
                                curLatitude:res.data[0].curLatitude
                            })
                        },fail: () => {
                            wx.showToast({
                                title:'当前位置获取失败'
                            })
                        }
                    })
                }
            })
        }
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
        const { schoolID, roomID } = this.data
        wx.navigateTo({
            url:'/pages/chatroom/chatroomDetail/chatroomDetail',
            // +this.data.chatroomId+this.data.schoolID,
            success:function(res){
                res.eventChannel.emit('getUserInfo',
                { 
                    schoolID: schoolID, 
                    roomID: roomID
                })
            }
        })
    },
    //选择地点
    positionSearch(){
        let that = this
        wx.chooseLocation({
            success(res){
                that.setData({
                    curLatitude:res.latitude,
                    curLongitude:res.longitude,
                    isChooseManually: true
                })
                console.log('接口调用成功',res)
            },
            fail(res){
                console.log('接口调用失败', res)
            }
        })
    },

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
        this.firstGetCurrentLocation()
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