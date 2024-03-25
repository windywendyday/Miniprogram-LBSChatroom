// pages/signupFirstPage/signupSecondPage.js

const db = wx.cloud.database().collection('userInfo')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myschoolID:'',
        captcha:'',//验证码
        password:''//密码
    },
    toIndex(){
        wx.switchTab({
            url:'/pages/index/index'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            myschoolID: options.schoolID
        })
    },

    // 获得表单数据
    handleInput(event){
        //let type = event.currentTarget.id;//id传值
        let type = event.currentTarget.dataset.type;//data-key = value
        this.setData({
            [type]:event.detail.value
        })
    },

    
    
    //验证码正确，将学号和密码添加到数据库中
    addData(){
        //判断验证码是否正确
        if(this.data.captcha){
            db.add({
                data:{
                    schoolID:this.data.myschoolID,
                    password:this.data.password,
                    avatar:'cloud://lbschatroom-0gjko5o76144c24e.6c62-lbschatroom-0gjko5o76144c24e-1316859570/默认头像.svg',
                    nickname:'默认昵称'
                },
                success:res => {
                    db.where({
                        _id:res._id
                    }).get({
                        success:res1 => {
                            wx.setStorageSync('userProfile',JSON.stringify(res1))
                        }
                    })
                    wx.showToast({
                        title: '注册成功',
                    })
                },fail(res){
                    console.log('添加数据失败',res)
                    return;
                },
            })
            wx.reLaunch({
                url: '/pages/index/index?myschoolID='+this.data.myschoolID,
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})