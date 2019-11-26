var util = require('../../utils/util.js');
var app = getApp();

Page({
    data: {
        title: '',
        num: '166695944'
    },
    //事件处理函数
    onLoad: function (options) {
        // 
    },
  
  copy: function (e) {
    var that = this;
    console.log(e);
    wx.setClipboardData({
      data: that.data.orderNo,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  /**
    * 一键复制
    */
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.num,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
})
