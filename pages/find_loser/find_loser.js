//获取应用实例
var tcity = require("../../utils/cardNames.js");
var tcity2 = require("../../utils/schools.js");
var util = require('../../utils/util.js');
var log = require('../../utils/log.js');
var app = getApp()
Page({
  data: {
    cardId: '',//卡号
    cardData:[],
    cardNames:[],//卡片集合
    cardName: '',//卡片
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
      schoolCode: this.data.schoolData[e.detail.value].code,
      school: this.data.schoolData[e.detail.value].name,
    })
  },
  open: function () {
    this.setData({
      cardNames:cardNames,
      schools: schools
    })
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
      'cardNames': cardNames,
      'cardName': cardNames[0],
      'schools': schools,
      'school': schools[0],
    })
    console.log('初始化完成');
    var cardId = '';
    that.setData({
      cardId: cardId,
    })

  },
  //卡号输入
  input: function (event) {
    
    var val = event.target.dataset.type;
    console.log('input()'+val);
    if (val == "cardid") {
      this.setData({
        cardId: event.detail.value
      })
    }
    else if (val == "name")
    {
      this.setData({
        loserName: event.detail.value
      })
    }
    else if (val == "major") {
      this.setData({
        majorName: event.detail.value
      })
    }
     
  },
  //确定
  confirm: function (e) {

    var fromId = e.detail.formId;
    var that = this;
    var data = this.data;
    
    if (!data.cardId) {
      wx.showToast({
        title: '请输入卡号',
        icon: '12',
        duration: 2000
      });
      return false;
    }

    if (!data.loserName)
    {
      wx.showToast({
        title: '请输入失卡人姓名',
        icon: '12',
        duration: 2000
      });
      return false;
    }

    wx.showLoading({
      title: '正在寻找',
      //icon: 'loading',
      //image: '../../images/rose.jpg',
      //duration: 3000
    })

    // 获取uuid
    var seqId = util.wxuuid();
    log.info("find loser: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId);
    //保存数据
    wx.request({
      url: 'http://' + app.globalData.backIp + ':' + app.globalData.bizmgrPort + '/finder/bizmgr/pickupcard',
      data: {
        cardId: data.cardId,
        cardName: data.cardName,
        openId: app.globalData.openId,
        unionId: app.globalData.unionId,
        loserName: data.loserName,
        schoolName: data.school,
        majorName: data.major,
        seqId: seqId,
        fromId: fromId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        wx.hideLoading();
        log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", statusCode:" + res.data.result.statusCode + ", fromId:" + fromId);
        if ((res.data.errorNo == 0) && (res.data.result.statusCode == 1)){
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
        else if ((res.data.errorNo == 0) && (res.data.result.statusCode == 2)){
          
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
          log.error("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", statusCode:" + res.data.result.statusCode);
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
        log.error("return res: seqId:" +seqId);
        wx.hideLoading();

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
        wx.hideLoading();
      }
    })
  }
})
