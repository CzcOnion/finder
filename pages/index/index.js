//index.js
var log = require('../../utils/log.js') // 引用log.js文件
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    imgUrls: [
      '../../images/banner2.png',
      '../../images/invit2.png',
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    circular: true, //是否采用衔接滑动
    noticeList:[
      {
        context: "卡号:3901160315 \n 姓名:陈 \n 学校: 中南大学"
      },
      {
        context: "这是第二条公告"
      }
    ],
  },
  onLoad: function (options) {
    var that = this;
    var seqId = util.wxuuid();;
    // 生命周期函数--监听页面加载
    //广告轮播图
    wx.request({
      url: 'http://' + app.globalData.backIp + ':' + app.globalData.bizmgrPort + '/finder/bizmgr/adimages',
      data: {
        seqId:seqId,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        log.info("seqId:" + seqId + ", length:" + res.data.result.imgUrls.length)
        var carousel = res.data.result.imgUrls;
        if (carousel.length) {
          var tampArr = [];
          for (var i = 0; i < carousel.length; i++) {
            tampArr.push(carousel[i])
          }
          that.setData({
            imgUrls: tampArr
          })
          
        }
        else
        {
          // default images
          imgUrls.push('../../images/banner2.png');
          imgUrls.push('../../images/invit2.png');
        }
        
        // success
      },
      fail: function () {
        log.error('获取广告图错误,' + 'seqId:' + seqId);
      },
      complete: function () {
        // complete
      }
    })
    
    // 获取失卡公告
    wx.request({
      url: 'http://' + app.globalData.backIp + ':' + app.globalData.bizmgrPort + '/finder/bizmgr/losscards',
      data: {
        seqId: seqId,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var carousel = res.data.result.noticeList;
        log.info("seqId:" + seqId + ", length:" + res.data.result.noticeList.length)
        if (carousel.length) {
          var tampArr = [];
          for (var i = 0; i < carousel.length; i++) {
            tampArr.push(carousel[i])
          }
          that.setData({
            noticeList: tampArr
          })
        }
        // success
      },
      fail: function () {
        // fail
        log.error('error');
        log.error('获取广告图错误,' + 'seqId:' + seqId);
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
