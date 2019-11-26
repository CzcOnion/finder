//获取应用实例
var tcity = require("../../utils/schools.js");
var util = require('../../utils/util.js');
var log = require("../../utils/log.js")
var app = getApp()
Page({
  data: {
    name: '',//姓名
    bindName:'',
    phone: '',//电话号码
    bindPhone:'',
    schoolData: [],
    schools:[],//学校集合
    school: '未绑定', //bindSchoolName 为用户注册的学校名，school为用户在当前页面选择的学校名
    pickSchoolName: '', // 用户页面选择器的值 school在一开始应该与bindSchoolName一样 后面与pickSchoolName一样
    bindSchoolName: '未绑定',
    major:'',
    majorCode:'',
    bindMajorName: '',
    index:0,
  },
  //学校选择器
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      pickSchoolName: this.data.schools[e.detail.value],
      school: this.data.schools[e.detail.value]
    })
  },
  open: function () {
    this.setData({
      schools:schools
    })
  },
  onLoad: function (options) {
    var that = this;
    //设置城市选择
    console.log("onLoad");
    tcity.init(that);
    this.schoolData = that.data.schoolData;
    const schools = [];
    for (let i = 0; i < this.schoolData.length; i++) {
      schools.push(this.schoolData[i].name);
    }
    that.setData({
      'schools':schools,
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
    // 获取seqId
    var seqId = util.wxuuid();
    // 获取信息
    wx.request({
      url: app.globalData.backIp + ':' + app.globalData.backPort + "/getRegUserInfo",
      data: {
        sqeId: seqId,
        openId: app.globalData.openId,
        unionId: app.globalData.unionId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        if (res.data.errorNo == 0)
        {
          that.setData({
            bindName: res.data.result.userName,
            name: res.data.result.userName,
            bindSchoolName: res.data.result.schoolName,
            pickSchoolName: res.data.result.schoolName,
            bindMajorName: res.data.result.majoName,
            major: res.data.result.majoName,
            bindPhone: res.data.result.phoneNum,
            phone: res.data.result.phoneNum,
          })
          
        }
        else
        {
          log.error("服务器发生错误" + ", seqId:" + seqId);
          wx.showModal({
            title: '获取信息失败',
            content: '服务器发生错误,无法获取您的个人信息！',
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
      },
      fail:function()
      {
        log.error("网络发生错误" + ", seqId:" + seqId);
        // 上线时恢复 wangyechao
        wx.showModal({
          title: '获取信息失败',
          content: '网络发生错误,无法获取您的个人信息！',
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
    })
  },
  //姓名手机号详细地址输入
  input: function (event) {
    var val = event.target.dataset.type;
    console.log('input()'+val);
    if (val == "name") {
      this.setData({
        name: event.detail.value
      })
    } else if (val == "phone") {
      this.setData({
        phone: event.detail.value
      })
    }else if (val == "major") {
      this.setData({
        major: event.detail.value
      })
    }
    console.log(event.detail.value)
  },
  //确定
  confirm: function () {
    var that = this;
    console.log(this.data)
    var data = this.data;

  // wangyechao 
    if (!data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: '12',
        duration: 2000
      });
      return false;
    }

    if (!data.phone) {
      wx.showToast({
        title: '请输入手机号',
        duration: 2000
      });
      return false;
    }
    
    if (data.school == '未绑定')
    {
      wx.showToast({
        title: '请选择学校',
        duration: 2000
      });
      return false;
    }

    wx.showToast({
      title: '保存中...',
      icon: 'loading',
      duration: 10000
    });
    console.log(data);
    console.log('设置缓存')
    
    var seqId = util.wxuuid();
    wx.request({
      url: app.globalData.backIp + ':' + app.globalData.backPort,
      data: {
        seqId:seqId,
        name: data.name,
        phone: data.phone,
        school: data.school,
        major: data.major,
        openId: app.globalData.openId,
        unionId: app.globalData.unionId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        wx.hideToast();
        if (res.data.errorNo == 0) {
          wx.showToast({
            title: '操作成功',
          })
          this.onLoad();
        } else 
        {
          wx.showModal({
            title: '无法更改',
            content: '服务器发生错误,麻烦您重新提交一次，如果多次提交不行，请在公众号回复“客服”，加客服反馈',
            showCancel: false,
            confirmText: '朕知道了',
          })
        }
        // success
      },
      fail: function () {
        wx.hideToast();
        // fail
        wx.showModal({
          title: '无法更改',
          content: '网络器发生错误,麻烦您重新提交一次，如果多次提交不行，请在公众号回复“客服”，加客服反馈',
          showCancel: false,
          confirmText: '朕知道了',
        })
      },
      complete: function () {
       
      }
    })
  }
})
