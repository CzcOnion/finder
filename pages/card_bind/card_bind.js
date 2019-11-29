//获取应用实例
var tcity = require("../../utils/cardNames.js");
var util = require('../../utils/util.js');
var log = require('../../utils/log.js');
var app = getApp()
Page({
  data: {
    cardId: '',//卡号
    cardData:[],
    cardNames:[],//卡片集合
    cardName: '',//卡片
    card_index:0,
    cardCode:0,
    
  },
  //卡类型选择器
  bindPickerChange_card: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      card_index: e.detail.value,
      cardCode: this.data.cardData[e.detail.value].code,
      cardName: this.data.cardData[e.detail.value].name,
    })
  },
  open: function () {
    // this.setData({
    //   cardNames:cardNames,
    // })
  },
  onLoad: function (options) {
    var that = this;
    //设置城市选择
    console.log("onLoad");
    tcity.init(that);
    var cardData = that.data.cardData;
    const cardNames = [];
    for (let i = 0; i < cardData.length; i++) {
      cardNames.push(cardData[i].name);
    }

    var cardId = '';
    that.setData({
      cardId: cardId,
      cardNames: cardNames,
      cardData: cardData,
    })

  },
  //卡号输入
  input: function (event) {
    
    var val = event.target.dataset.type;
    console.log('input()'+val);
    if (val == "cardId") {
      this.setData({
        cardId: event.detail.value
      })
     
    } 
    console.log(event.detail.value);
  },
  //确定
  confirm: function () {
    if (app.globalData.isRegister != 1)
    {
      wx.showModal({
        title: '无法绑定',
        content: '您还未注册个人信息，无法绑定，请注册后重试，谢谢！',
        showCancel: false,
        confirmText: '朕知道了',
        success(res) {
          //返回页面
          wx.navigateBack
            ({
              delta: 1
            })
        }
      })
      return false;
    }
    
    var that = this;
    console.log(this.data)
    var data = this.data;
    if (!data.cardId) {
      wx.showToast({
        title: '请输入卡号',
        icon: '12',
        duration: 2000
      });
      return false;
    }
    wx.showToast({
      title: '正在绑定',
      icon: 'loading',
      duration: 50000,
    })
    // 获取uuid
    var seqId = util.wxuuid();
    log.info("bind card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId + "cardName:" + data.cardName);
    //保存数据
    wx.request({
      url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/card',
      data: {
        cardId: data.cardId,
        cardName: data.cardName,
        openId: app.globalData.openId,
        unionId: app.globalData.unionId,
        seqId: seqId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        wx.hideToast();
        console.log(res);
        log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
        if (res.data.errorNo == 0){
          log.info("bind success: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
          wx.showToast({
            title: '绑定成功',
          })
        } 
        else{
          if (res.data.errorNo == 300105)
          {
            log.info("用户重复绑定 seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
            wx.showModal({
              title: '绑定不成功',
              content: '您已经绑定该卡片，请勿重复绑定！',
              showCancel: false,
              confirmText: '朕知道了',
              success(res) {
                //返回页面
                wx.navigateBack
                  ({
                    delta: 1
                  })
              }
            })
            return false;
          }
          log.error("server error!bind error: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
          wx.showModal({
            title: '绑定不成功',
            content: '服务器生病了，绑定不成功，请重试！如果多次不成功请联系客服！',
            showCancel: false,
            confirmText: '朕知道了',
            success(res) {
              //返回页面
              wx.navigateBack
                ({
                  delta: 1
                })
            }
          })
        }
        // success
      },
      fail: function () {
        wx.hideToast();
        log.error("网络出问题!bind error: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
        wx.showModal({
          title: '绑定不成功',
          content: '网络出问题，绑定不成功，请重试！如果多次不成功请联系客服！',
          showCancel: false,
          confirmText: '朕知道了',
          success(res) {
            //返回页面
            wx.navigateBack
              ({
                delta: 1
              })
          }
        })
      },
      complete: function () {
        wx.navigateBack
          ({
            delta: 1
          })
      }
    })
  }
})
