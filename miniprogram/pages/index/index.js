// pages/index/index.js
const db = wx.cloud.database().collection('userInfo')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msg:'初始化测试数据',
        userSchoolID:'',
        userNickname:'',
        userAvatar: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options.myschoolID)
        db.where({
            schoolID:options.myschoolID
        }).get({
            success:res => {
                this.setData({
                    userSchoolID:res.data[0].schoolID,
                    userNickname:res.data[0].nickname,
                    userAvatar:res.data[0].avatar
                })
            },fail: () => {
                wx.showToast({
                    title:'获取失败！'
                })
            }
        })
    },
    toPasswordChange(){
        wx.navigateTo({
            url:'/pages/passwordChange/passwordChange?userSchoolID='+this.data.userSchoolID
        })
    },

    exitConfirm(){
        wx.showModal({
            title: '退出登录',
            content: '你确定要退出登录吗？',
            success (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.reLaunch({
                        url:'/pages/login&signup/login/login'
                    })
                    wx.clearStorage()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }

})