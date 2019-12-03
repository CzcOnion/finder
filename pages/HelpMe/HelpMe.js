var util = require('../../utils/util.js');
var log = require('../../utils/log.js');
var app = getApp();

Page({
    data: {
        title: '',
      showText: [" ","已挂失"],
      showText2: ['挂失','解挂'],
      items: [],
    },
    //事件处理函数
    onLoad: function (options) {
      var that = this;

      var seqId = util.wxuuid();
      log.info("get cardlist: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId);

      //playingList
      wx.request({
        url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/cards/' + app.globalData.openId,
          method: 'GET',
          data: {
            seqId: seqId,
            openId:app.globalData.openId,
            unionId:app.globalData.unionId
          },
          header: {
              'Accept': 'application/json'
          },
          success: function(res) {
              log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", items:" + res.data.result.items);
              that.setData({
                items: res.data.result.items,
              })
          },
          fail: function (res) 
          {
            log.error("无法拉取卡片，网络发生错误 seqId:" + seqId);
          },
      })
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的卡片'
        })
    },
  thank: function (event) {
    wx.showModal({
      title: '感谢他人',
      content: '你确定收卡并感谢拾卡人吗？',
      success(res) 
      {
        if (res.confirm) {
          console.log('用户点击确定');
          // 获取uuid
          var seqId = util.wxuuid();
          console.log(seqId);
          // 获取cardName
          var cardName = event.currentTarget.dataset.cardname; // cardname 是小写
          // 获取cardId
          var cardId = event.currentTarget.dataset.cardid; // cardid 是小写的id
          console.log(cardId);
          wx.showToast({
            title: '正在发送',
            icon: 'loading',
            duration: 10000,
          })
          log.info("thank card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId + ", cardName:" + cardName + ", cardId:" + cardId);
          wx.request({
            url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/thankOther',
            method: "PUT",
            data: {
              seqId: seqId,
              openId:app.globalData.openId,
              unionId:app.globalData.unionId,
              info: info
            },
            success: function (res) {
              console.log(res.data)
              wx.hideToast();
              if (res.data.errorNo == 0)
              {
                wx.showToast({
                  title: '发送成功',
                })
                log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
              }
              else
              {
                wx.showModal({
                  title: '感谢未成功',
                  content: '感谢不成功，请重试，如果还不成功可联系客服处理！',
                  showCancel: false,
                  confirmText: '朕知道了',
                  
                })
                log.error("解绑不成功 res: seqId:" + seqId + "res.errNo:" + res.data.errorNo + ", cardName:" + cardName + ", cardId:" + cardId);
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '解绑未成功',
                content: '网络发生错误，无法解绑，请稍后再试试！',
                showCancel: false,
                confirmText: '朕知道了',
            
              })
              log.error("网络不成功 seqId:" + seqId + ", cardName:" + cardName + ", cardId:" + cardId);
            },
            complete: function (res) {
              //返回页面
              // wx.navigateBack
              //   ({
              //     delta: 1
              //   })
              
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      } 
    })
    },
  lostcard: function (event) {
    wx.showModal
    ({
      title: '挂失卡片',
      content: '你确定挂失该卡片吗',
      success(res)
        {
        var that = this;
        //var data = that.data;
        // 获取uuid
        var seqId = util.wxuuid();
        console.log(seqId);
        // 获取cardName
        var cardName = event.currentTarget.dataset.cardname;
        // 获取cardId
        var cardId = event.currentTarget.dataset.cardid; // cardid 是小写的id
        wx.showToast({
          title: '正在挂失',
          icon: 'loading',
          duration: 10000,
        })
        log.info("untying card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId + ", cardName:" + cardName + ", cardId:" + cardId);
        wx.request
        ({
            url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/losscard/' + cardId,
          method: "PUT",
          data: {
            seqId: seqId,
            openId: app.globalData.openId,
            unionId: app.globalData.unionId,
            cardName: cardName,
            cardId: cardId,
          },
          success: function (res) {
            console.log(res.data)
            wx.hideToast();
            if (res.data.errorNo == 0) {
              wx.showToast({
                title: '挂失成功',
              })
              log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + "hasBindCard:" + res.data.result.hasBindCard);
              
              // 刷新
              that.setData({});
            }
            else {
              wx.showModal({
                title: '挂失未成功',
                content: '挂失不成功，请重试，如果还不成功可联系客服处理！',
                showCancel: false,
                confirmText: '朕知道了',

              })
              log.error("挂失不成功 res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", cardName:" + cardName + ", cardId:" + cardId);
            }
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '挂失未成功',
              content: '网络发生错误，无法挂失，请稍后再试试！',
              showCancel: false,
              confirmText: '朕知道了',

            })
            log.error("网络不成功 seqId:" + seqId + ", cardName:" + cardName + ", cardId:" + cardId);
          },
          complete: function (res) 
          {
          },
        })
      }
    })
   },
  
  
  untie:function(event){
    wx.showModal
      ({
        title: '解挂卡片',
        content: '你确定已经找到卡片或者补办，而解挂该卡片吗？',
        success(res) {
          if (res.confirm)
          {
            var that = this;
            //var data = this.data;
            // 获取uuid
            var seqId = util.wxuuid();
            console.log(seqId);
            // 获取cardName
            var cardName = event.currentTarget.dataset.cardname;
            // 获取cardId
            var cardId = event.currentTarget.dataset.cardid; // cardid 是小写的id
            wx.showToast({
              title: '正在解挂',
              icon: 'loading',
              duration: 100000,
            })
            log.info("untie card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId + ", cardName:" + cardName + ", cardId:" + cardId);
            wx.request
              ({
                url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/unitecard/' + cardId,
                method: "PUT",
                data: {
                  seqId: seqId,
                  openId: app.globalData.openId,
                  unionId: app.globalData.unionId,
                  cardName: cardName,
                  cardId: cardId,
                },
                success: function (res) {
                  console.log(res.data)
                  wx.hideToast();
                  if (res.data.errorNo == 0) {
                    wx.showToast({
                      title: '挂失成功',
                    })
                    log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);

                    // 刷新
                    that.setData({});
                  }
                  else {
                    wx.showModal({
                      title: '解挂未成功',
                      content: '解挂不成功，请重试，如果还不成功可联系客服处理！',
                      showCancel: false,
                      confirmText: '朕知道了',

                    })
                    log.error("解挂不成功 res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", cardName:" + cardName + ", cardId:" + cardId);
                  }
                },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: '解挂未成功',
                  content: '网络发生错误，无法解挂，请稍后再试试！',
                  showCancel: false,
                  confirmText: '朕知道了',

                })
                log.error("网络不成功 解挂 seqId:" + seqId + ", cardName:" + cardName + ", cardId:" + cardId);
              },
              complete: function (res) {
              },
            })
          }
          else if(res.cancel)
          {

          }
        }
      })
  },
  openwin: function (event) { //跳转页面

    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
    },

})
