var util = require('../../utils/util.js');
var app = getApp();

Page({
    data: {
        title: ''
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this

        //playingList
        wx.request({
            url: 'http://json.bmbstack.com/cinemaList',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                console.log(res.data);
                that.data.items = res.data.result.items
            }
        })
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的卡片'
        })
    },
  untying: function (event) {
    wx.showModal({
      title: '解绑卡片',
      content: '你确定解绑该卡片吗',
      success(res) 
      {
        if (res.confirm) {
          console.log('用户点击确定');
          // 获取uuid
          var seqId = util.wxuuid();
          console.log(seqId);
          // 获取cardType
          var cardType = event.currentTarget.dataset.cardtype;
          // 获取cardId
          var cardId = event.currentTarget.dataset.cardid; // cardid 是小写的id
      
          wx.showToast({
            title: '正在解绑',
            icon: 'loading',
            duration: 5000,
          })
          wx.request({
            url: 'http://localhost:8080/usermgr/untyingCard',
            method: "POST",
            data: {
              seqId: seqId,
              openId:app.globalData.openId,
              unionId:app.globalData.unionId,
              cardType:cardType,
              cardId:cardId,
            },
            success: function (res) {
              wx.hideToast();
              var error_code = res.data.error_code;
              if (res.data.errorNo == 0)
              {
                wx.showToast({
                  title: '解绑成功',
                })
                this.onLoad();
              }
              else
              {
                wx.showModal({
                  title: '解绑未成功',
                  content: '解绑不成功，请重试，如果还不成功可联系客服处理！',
                  showCancel: false,
                  confirmText: '朕知道了',
                  
                })
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '解绑未成功',
                content: '网络发生错误，无法解绑，请稍后再试试！',
                showCancel: false,
                confirmText: '朕知道了',
            
              })
            },
            complete: function (res) {
              //返回页面
              // wx.navigateBack
              //   ({
              //     delta: 1
              //   })
              
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
})
