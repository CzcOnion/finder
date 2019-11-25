//获取应用实例
var tcity = require("../../utils/cardtypes.js");
var util = require('../../utils/util.js');

var app = getApp()
Page({
  data: {
    cardnum: '',//卡号
    cardData:[],
    cardtypes:[],//卡片集合
    cardtype: '',//卡片
    card_index:0,
    cardCode:0,
    
  },
  //卡类型选择器
  bindPickerChange_card: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      card_index: e.detail.value,
      cardCode: this.data.cardData[e.detail.value].code
    })
  },
  open: function () {
    // this.setData({
    //   cardtypes:cardtypes,
    // })
  },
  onLoad: function (options) {
    var that = this;
    //设置城市选择
    console.log("onLoad");
    tcity.init(that);
    var cardData = that.data.cardData;
    const cardtypes = [];
    for (let i = 0; i < cardData.length; i++) {
      cardtypes.push(cardData[i].name);
    }

    console.log('初始化完成');
    var value = '';
    //TODO 缓存
    try {
      value = wx.getStorageSync('cardData');
      console.log('getStorageSyc');
    } catch (e) {
      // Do something when catch error
    }
    console.log('缓存');
    console.log(value);

    var cardnum = '';
    that.setData({
      cardnum: cardnum,
      cardtypes: cardtypes,
    })

  },
  //卡号输入
  input: function (event) {
    
    var val = event.target.dataset.type;
    console.log('input()'+val);
    if (val == "cardnum") {
      this.setData({
        cardnum: event.detail.value
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
    if (!data.cardnum) {
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
    console.log(seqId);
    //保存数据
    wx.request({
      url: app.globalData.backIp + ':' + app.globalData.backPort,
      data: {
        cardnum: data.cardnum,
        cardtype: data.cardtype,
        cardCode: data.cardCode,
        openId: app.globalData.openId,
        unionId: app.globalData.unionId,
        seqId: seqId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        wx.hideToast();
        console.log(res)
        if ((res.data.errorNo == 0) && (res.data.result.errorCode == 1)){
          
        } 
        else{
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
        //wx.hideToast()
      }
    })
  }
})
