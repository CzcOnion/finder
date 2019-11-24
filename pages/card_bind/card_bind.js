//获取应用实例
var tcity = require("../../utils/cardtypes.js");
var tcity2 = require("../../utils/schools.js");
var util = require('../../utils/util.js');

var app = getApp()
Page({
  data: {
    cardnum: '',//卡号
    cardData:[],
    cardtypes:[],//卡片集合
    cardtype: '',//卡片
    schoolData:[],
    schools: [],//学校集合
    school: '',//学校
    card_index:0,
    school_index:0,
    loserName: '',
    major: '',
    schoolCode:0,
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
  bindPickerChange_school: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      school_index: e.detail.value,
      schoolCode: this.data.schoolData[e.detail.value].code
    })
  },
  open: function () {
    this.setData({
      cardtypes:cardtypes,
      schools: schools
    })
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

    tcity2.init(that);
    var schoolData = that.data.schoolData;
    const schools = [];
    console.log("data lengeh:");
    console.log(schoolData.length);
    for (let i = 0; i < schoolData.length; i++) {
      schools.push(schoolData[i].name);
    }
    console.log(schools.length);
    that.setData({
      'cardtypes': cardtypes,
      'cardtype': cardtypes[0],
      'schools': schools,
      'school': schools[0],
    })
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
    var that = this;
    console.log(this.data)
    var data = this.data;
    console.log("debug 1");
    if (!data.cardnum) {
      wx.showToast({
        title: '请输入卡号',
        icon: '12',
        duration: 2000
      });
      return false;
    }
    data.cardnum = '15';
    console.log("debug 2");
    wx.showLoading({
      title: '正在寻找',
      //icon: 'loading',
      //image: '../../images/rose.jpg',
      //duration: 3000
    })

    console.log(data);
    console.log('设置缓存');
    //设置缓存
    wx.setStorageSync("cardData", data);
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
        openid: app.globalData.openid,
        unionid: app.globalData.unionid,
        loserName: data.loserName,
        school: data.school,
        schoolCode: data.schoolCode,
        major: data.major,
        seqId: seqId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        if ((res.data.errorNo == 0) && (res.data.result.errorCode == 1)){
          wx.showModal({
            title: '赠人玫瑰，手有余香！',
            content: '已经通知失主，静待其与您联系', 
            showCancel: false,
            confirmText: '朕知道了',
            success(res) 
            {
              //返回页面
              wx.navigateBack
              ({
                delta: 1
              })
            }
          })
          
        } 
        else if ((res.data.errorNo == 0) && (res.data.result.errorCode == 2)){
          
          wx.showModal({
            title: '好事多磨',
            content: '失主未登记信息，系统将通过其他方式与其联系，请你添加客服微信，                      我们将与你一起找到失主归还',
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
        else
        {
          
          wx.showModal({
            title: '好事多磨',
            content: '服务器发生错误,麻烦您重新提交一次,感谢您的善举',
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
        wx.hideLoading();
        console.log('in fali');
        wx.showModal({
          title: '好事多磨',
          content: '服务器发生错误,麻烦您重新提交一次,感谢您的善举',
          showCancel: false,
          confirmText: '朕知道了',
          // success(res) {
          //   //返回页面
          //   wx.navigateBack
          //     ({
          //       delta: 1
          //     })
          // }
        })
      },
      complete: function () {
        //wx.hideToast()
      }
    })
  }
})
