// pages/login.js
const db = wx.cloud.database().collection('userInfo')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolID:'',
        password:'',
        match:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getStorage({
            key:'userProfile',
            success(res){
                console.log(res)
                if(res){
                    console.log('登录成功111')
                    wx.reLaunch({
                        url:'/pages/index/index'
                    })
                }
            },
            fail(res){
                console.log(res)
            }
        })

    },

    toIndex(){
        wx.switchTab({
            url:'/pages/index/index'
        })
    },
    toSignup(){
        wx.reLaunch({
            url:'/pages/login&signup/signupFirstPage/signupFirstPage'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    // 获得表单数据
    handleInput(event){
        //let type = event.currentTarget.id;//id传值
        let type = event.currentTarget.dataset.type;//data-key = value
        this.setData({
            [type]:event.detail.value
        })
    },
    //登录函数
    login(){
        /*学号验证
            1.内容为空
            2.学号格式不正确
            3.学号格式正确，前端验证通过
         */
        if(!this.data.schoolID){
            //提示用户
            wx.showToast({
                title:'学号不能为空',
                icon:'none'
            })
            return;
        };
        if(!this.data.password) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
            return;
        }
        //定义正则表达式
        let schoolIDReg = /(U20|M20|D20)\d{7}$/;
        if(!schoolIDReg.test(this.data.schoolID)){
            wx.showToast({
                title:'学号格式错误',
                icon:'none'
            })
            return;
        };
        this.isMatch();
        setTimeout(() => {
            if(this.data.match){
                wx.showToast({
                    title:"登录成功",
                    icon:"none"
                });
                this.toIndex()
            }
        },1000)
    },
    isMatch(){
        //在数据库里查询账号密码是否匹配
        //获取数据库里的数据
        db.where({
            schoolID:this.data.schoolID
        }).get({
            success:res => {
                console.log('数据库api获取数据成功')
                if (res.data[0].password === this.data.password){
                    this.data.match = true;
                    wx.setStorageSync('userProfile',JSON.stringify(res))
                }
            },fail(res){
                console.log('该用户不存在')
            }
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