//index.js
var log = require('../../utils/log.js') // 引用log.js文件

//获取应用实例
var app = getApp();
Page({
  data: {
    imgUrls: [
      '../../images/banner.png',
      '../../images/banner1.jpeg',
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    circular: true, //是否采用衔接滑动
    noticeList:[
      {
        url:"../../images/notice.png",
        context: "卡号3901160315\n姓名陈至聪\n学校中南大学"
      },
      {
        url: "../../images/notice.png",
        context: "这是第二条公告"
      }
    ],
  },
  onLoad: function (options) {
    var that = this;
    // 生命周期函数--监听页面加载
    //轮播图
    wx.request({
      url: app.globalData.serverUrl + 'getCarousel',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var carousel = res.data.data.carousel;
        if (carousel.length) {
          var tampArr = [];
          for (var i = 0; i < carousel.length; i++) {
            tampArr.push(carousel[i].uploadFiles)
          }
          that.setData({
            imgUrls: tampArr
          })
        }
        // success
      },
      fail: function () {
        // fail
        log.error('error');
        log.setFilterMsg('轮播图');
      },
      complete: function () {
        // complete
      }
    })
    //热门手机
    wx.request({
      url: app.globalData.serverUrl + 'getRepairHot',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        var repairHot = res.data.data.repairHot;
        that.setData({
          hotimg1: repairHot[0].imageUrl,
          hotimg2: repairHot[1].imageUrl,
          hotimg3: repairHot[2].imageUrl,
          brandID1: repairHot[0].brandID,
          brandID2: repairHot[1].brandID,
          brandID3: repairHot[2].brandID,
          modelID1: repairHot[0].modelID,
          modelID2: repairHot[1].modelID,
          modelID3: repairHot[2].modelID,
          hottext1: repairHot[0].modelName,
          hottext2: repairHot[1].modelName,
          hottext3: repairHot[2].modelName,
        })
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },
  openwin1: function (event) { //带参数跳转手机页面
    console.log(event.target.dataset.brandid)
    wx.navigateTo({
      url: '../select_phone/select_phone?brandID=' + event.target.dataset.brandid + '&modelID=' + event.target.dataset.modelid
    })
  },
  openwinTab:function(event){
    console.log(event)
    var path = event.target.dataset.url;
    wx.switchTab({
      url: '../' + path + '/' + path
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
      title: '失卡招领', // 分享标题
      desc: '一个失卡招领的平台', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  }
})
