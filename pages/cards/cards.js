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
                that.data.items = res.data
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
          var cardType = event.currentTarget.dataset.cardType;
          // 获取cardId
          var cardId = event.currentTarget.dataset.cardid; // cardid 是小写的id
          console.log("cardType");
          console.log(cardType);
          console.log("cardId");
          console.log(cardId);
          wx.request({
            url: 'http://localhost:8080/usermgr/untyingCard',
            method: "POST",
            data: {
              seqId: seqId,
              openid:app.globalData.openid,
              unionid:app.globalData.unionid,
              cardType:cardType,
              cardId:cardId,
            },
            success: function (res) {
              var error_code = res.data.error_code;
              if (error_code == 1)
              {
                wx.showToast({
                  title: '解绑成功',
                })
              }
              else if (error_code == 2)
              {
                wx.showModal({
                  title: '很遗憾',
                  content: '解绑不成功，请重试，如果还不成功可联系客服处理！',
                  showCancel: false,
                  confirmText: '朕知道了',
                  
                })
              }
              else if (error_code == 3)
              {

              }
            },
            fail: function (res) {
              wx.showModal({
                title: '很遗憾',
                content: '网络发生错误，无法解绑，请稍后再试试！',
                showCancel: false,
                confirmText: '朕知道了',
            
              })
            },
            complete: function (res) {
              //返回页面
              wx.navigateBack
                ({
                  delta: 1
                })
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
