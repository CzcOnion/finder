Page({
  data: {
    contentFlag1: true,
    data: [{
      title: '登记个人信息有什么用？',
      flag: true,
      content: '登记个人信息后，当有人拾取到你的卡片的时候，系统将能立马寻找到你给您发消息，让你尽快获取到丢失的卡片，而这不需要你自己做出任何努力，只要你登记下信息就可以'
    },
    {
      title: '如何登记卡片？',
      flag: true,
      content: '在首页就可以进行登记'
    },
    {
      title: '客服微信多少？',
      flag: true,
      content: '首页点击我要反馈，就有客服微信！'
    },]
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  taggle: function (event) {
    var index = event.target.dataset.index;
    var data = this.data.data;
    for (var i = 0; i < data.length; i++) {
      if(index == i){
        data[i].flag = !data[i].flag;
      }
    }
    this.setData({
      data: data
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '', // 分享标题
      desc: '', // 分享描述
      path: '' // 分享路径
    }
  }
})