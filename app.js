//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            url: "http://localhost:8080/usermgr/login",
            method:"POST",
            data: {
              code: res.code
            },
            success: function (res) {
              var app = getApp();
              console.log(res);
              app.globalData.openid = res.data.openid;
              app.globalData.unionid = res.data.unionid;
            },
            fail: function (res) {
              console.log(res);
              console.log("index.js wx.request CheckCallUser fail");
            },
            complete: function (res) {
              console.log(res);
              // complete
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    backIp: "122.51.236.116",
    backPort: "3306",
    openid: null,
    unioniud: null
  }
})