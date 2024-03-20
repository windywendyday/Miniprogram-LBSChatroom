// pages/setting/setting.js
const db = wx.cloud.database().collection('userInfo')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userSchoolID:'',//用户id
        docId:'',//对应的表的id
        oldPassword:'',//原密码
        match:false,
        newPassword:''//新密码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            userSchoolID:options.userSchoolID
        })
    },

    handleInput(event){
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

    change(){
        if(!this.data.oldPassword | !this.data.newPassword) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
            return;
        }
        this.isMatch();
        setTimeout(() => {
            if (this.data.match){
                this.updatePassword()
            }else {
                wx.showToast({
                    title:'原密码错误！'
                })
            }
        },1000);
    },

    //校验旧密码是否正确
    isMatch(){
        db.where({
            schoolID:this.data.userSchoolID
        }).get({
            success:res => {
                if (res.data[0].password === this.data.oldPassword){
                    this.setData({
                        docId: res.data[0]._id
                    });
                    this.data.match = true;
                }else {
                    wx.showToast({
                        title:'原密码错误！请重新输入'
                    })
                }
            },fail(res){
                console.log('出错了！请稍后再试')
            }
        });
    },

    //更新新密码到数据库里
    updatePassword(){
        db.doc(this.data.docId).update({
            data: {
                password:this.data.newPassword
            }
        }).then(() => {
            wx.showToast({
                title:'密码修改成功！'
            })
            setTimeout(()=>{wx.navigateBack()},1000)
        });

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