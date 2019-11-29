//获取应用实例
var tcity = require("../../utils/schools.js");
var util = require('../../utils/util.js');
var log = require("../../utils/log.js");
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
    wx.showToast({
      title: '正在获取信息',
      icon:'loading',
      duration:100000,
    })

    // 用户有注册才去获取信息
    if (app.globalData.isRegister == 1)//已经注册
    {
      // 获取seqId
      var seqId = util.wxuuid();
      log.info("get data: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId);
      // 获取信息
      wx.request({
        url: 'http://' + app.globalData.backIp + ':' + app.globalData.usermgrPort + '/finder/usermgr/user/' + app.globalData.openId,
        data: {
          seqId: seqId,
          unionId: app.globalData.unionId,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          wx.hideToast();
          log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", username:" + res.data.result.userName);
          if (res.data.errorNo == 0)
          {
            that.setData({
              bindName: res.data.result.userName,
              name: res.data.result.userName,
              bindSchoolName: res.data.result.schoolName,
              pickSchoolName: res.data.result.schoolName,
              school: res.data.result.schoolName,
              bindMajorName: res.data.result.majorName,
              major: res.data.result.majorName,
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
          wx.hideToast();
          log.error("网络发生错误" + ", seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId);
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
    }
    else
    {
      wx.hideToast();
    }
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
    if (!data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: '12',
        duration: 2000
      });
      return false;
    }

    if (data.phone.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    if (data.phone.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 2000
      })
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
    log.info("update data: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId);
    wx.request({
      url: 'http://' + app.globalData.backIp + ':' + app.globalData.usermgrPort + '/finder/usermgr/user/' + app.globalData.openId,
      data: {
        seqId:seqId,
        userName: data.name,
        phoneNum: data.phone,
        schoolName: data.school,
        majorName: data.major,
        openId: app.globalData.openid,
        unionId: app.globalData.unionid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
        wx.hideToast();
        if (res.data.errorNo == 0) {
          wx.showToast({
            title: '操作成功',
          })
          // 注意要赋值
          app.globalData.isRegister = 1;
          // 用于刷新页面
          that.setData({});
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
          content: '网络发生错误,麻烦您重新提交一次，如果多次提交不行，请在公众号回复“客服”，加客服反馈',
          showCancel: false,
          confirmText: '朕知道了',
        })
      },
      complete: function () {
       
      }
    })
  }
})
