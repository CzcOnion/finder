//获取应用实例
var tcity = require("../../utils/schools.js");

var app = getApp()
Page({
  data: {
    name: '',//姓名
    phone: '',//电话号码
    message: '',//备注
    schools:[],//学校集合
    schoolName:'',//学校
    majorName:'',//专业
    card_id:'',//卡号
    index:0,
  },
  //学校选择器
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
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
    var schoolData = that.data.schoolData;
    const schools = [];
    for (let i = 0; i < schoolData.length; i++) {
      schools.push(schoolData[i].name);
    }
    that.setData({
      'schools':schools,
      'school':schools[0]
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
    var name = '';
    // if (value.name != 'undefined') {
    //   name = value.name;
    // }
    var phone = '';
    // if (value.phone != 'undefined') {
    //   phone = value.phone;
    // }
    var school = '华南理工大学';
    // if (value.school != 'undefined') {
    //   school = value.school;
    // }

    var card_id = '';
    // if (value.card_id != 'undefined') {
    //   card_id = value.card_id;
    // }

    var major = '';
    // if (value.major != 'undefined') {
    //   major = value.major;
    // }

    var id = '';
    // if (value.id != 'undefined') {
    //   id = value.id;
    // }

    var message = '';
    console.log(name)
    that.setData({
      init_name: name,
      name: name,
      init_phone: phone,
      phone: phone,
      school:school,
      init_message:message,
      init_card_id:card_id,
      init_major:major,
      id: id
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
    } else if (val == "message") {
      this.setData({
        message: event.detail.value
      })
    }else if(val =="card_id"){
      this.setData({
        card_id: event.detail.value
      })
    } else if (val == "major") {
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
        duration: 1500
      })
      return false;
    }
    if (data.phone.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }

    if (!data.card_id) {
      wx.showToast({
        title: '请输入卡号',
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
    //设置缓存
    wx.setStorageSync("cardData", data);
    //保存数据
    wx.request({
      url: app.globalData.serverUrl + 'saveAddress',
      data: {
        name: data.name,
        phone: data.phone,
        //province: data.province,
        cardId: data.card_id,
        cardName: data.city,
        district: data.county,
        userID: app.globalData.userid,
        isOn: 1, //1正常，0删除
        id: that.data.id //有代码修改，无代表添加
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)

        if (res.data.errorNo == 0) {
          //返回页面
          wx.navigateBack({
            delta: 1
          })
        } else {
          setTimeout(function () {
            wx.showToast({
              title: res.data.error_msg,
              icon: 'success',
              duration: 2000
            })
          }, 2000)
        }
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        wx.hideToast()
      }
    })
  }
})
