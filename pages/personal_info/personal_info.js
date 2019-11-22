//获取应用实例
var tcity = require("../../utils/schools.js");

var app = getApp()
Page({
  data: {
    name: '',//姓名
    phone: '',//电话号码
    message: '',//备注
    schools:[],//学校集合
    school:'',//学校
    major:'',//专业
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

    

    var major = '';
    // if (value.major != 'undefined') {
    //   major = value.major;
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
      init_major:major,
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

    if (!data.phone) {
      wx.showToast({
        title: '请输入手机号',
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
      url: app.globalData.backIp + ':' + app.globalData.backPort,
      data: {
        name: data.name,
        phone: data.phone,
        school: data.school,
        major: data.major,
        openid: app.globalData.openid,
        unionid: app.globalData.unionid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)

        if (res.data.error_code == 0) {
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
