var app = getApp();
var util = require('../../utils/util.js');
var log = require('../../utils/log.js');// 引用log.js文件

Page({
  data: {
    imgArr: [],
    uploadimgArr: [],
    textareaVal: '',
    inputVal: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
 
  //问题和建议描述
  textareaVal: function (event) {
    this.setData({
      textareaVal: event.detail.value
    })
  },
  //提交
  confirm: function () {
    var textareaVal = this.data.textareaVal;
    var uploadimgArr = this.data.uploadimgArr;
    // if (!textareaVal) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写您的感谢话语',
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       }
    //     }
    //   })
    //   return false;
    // }
    // 获取uuid
    var seqId = util.wxuuid();
    console.log(seqId);
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      duration: 100000,
    })
    log.info("thank card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId);
    wx.request({
      url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/thankOther',
      method: "PUT",
      data: {
        seqId: seqId,
        openId: app.globalData.openId,
        unionId: app.globalData.unionId,
        info: textareaVal
      },
      success: function (res) {
        console.log(res.data)
        wx.hideToast();
        if (res.data.errorNo == 0) {
          wx.showToast({
            title: '发送成功',
          })
          log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
        }
        else {
          wx.showModal({
            title: '感谢未成功',
            content: '感谢不成功，请重试，如果还不成功可联系客服处理！',
            showCancel: false,
            confirmText: '朕知道了',

          })
          log.error("感谢不成功 res: seqId:" + seqId + "res.errNo:" + res.data.errorNo );
        }
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '发送未成功',
          content: '网络发生错误，无法解绑，请稍后再试试！',
          showCancel: false,
          confirmText: '朕知道了',
        })
        log.error("网络不成功 seqId:" + seqId );
      },
    })
 },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})