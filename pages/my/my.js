var app = getApp();
Page({
  data: {
    userInfo: '',
    registerText: '',
    bindText: '',
    isRegister: 0,
    hasBindCard: 0,
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      userInfo: app.globalData.userInfo,
      isRegister: app.globalData.isRegister,
      hasBindCard: app.globalData.hasBindCard,
    })

    var mRegText = '';
    if (app.globalData.isRegister == 1)
    {
      mRegText = "已注册";
    }
    else if (app.globalData.isRegister == 2)
    {
      mRegText = "未注册";
    }
    else
    {
      mRegText = "未知";
    }

    var mBindText = '';
    if (app.globalData.hasBindCard == 1) {
      mBindText = "已绑定";
    }
    else if (app.globalData.hasBindCard == 2) {
      mBindText = "未绑定";
    }
    else {
      mBindText = "未知";
    }

    this.setData({
      registerText: mRegText,
      bindText: mBindText,
    })

  },
  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },
  tel:function(){
    wx.makePhoneCall({
      phoneNumber: '400-9915591' //仅为示例，并非真实的电话号码
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    wx.removeStorage({
      key: 'order_data',
      success: function (res) {
        console.log(res)
      }
    })
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    // wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})