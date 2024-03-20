// pages/signupFirstPage/signupFirstPage.js
import PubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolID:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getStorage({
            key:'userProfile',
            success(res){
                console.log(res.data, '登录成功')
                wx.reLaunch({
                  url: '../../index/index',
                })
            },
            fail(res){
                console.log('登录已过期，请重新登录～', res)
            }
        })
    },

    toSignupSecond(){
        wx.navigateTo({
            url:'/pages/login&signup/signupSecondPage/signupSecondPage?schoolID='+this.data.schoolID
        })
    },

    toLogin(){
        wx.reLaunch({
            url:'/pages/login&signup/login/login'
        })
    },

    //获得表单数据
    handleInput(event){
        //let type = event.currentTarget.id;//id传值
        let type = event.currentTarget.dataset.type;//data-key = value
        this.setData({
            [type]:event.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    sendCaptcha(){
        if(!this.data.schoolID){
            //提示用户
            wx.showToast({
                title:'学号不能为空',
                icon:'none'
            })
            return;
        };
        //正则
        let schoolIDReg = /(U20|M20|D20)\d{7}$/;
        if(!schoolIDReg.test(this.data.schoolID)){
            wx.showToast({
                title:'学号格式错误',
                icon:'none'
            })
            return;
        };
        this.toSignupSecond()
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