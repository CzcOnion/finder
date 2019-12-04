var util = require('../../utils/util.js');
var log = require('../../utils/log.js');
var app = getApp();

Page({
    data: {
        title: '',
      showText: ["","已挂失","被拾取"],
      showText2: ['挂失','解挂','确认卡在手'],
      items: [],
      testval :0,
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
  untying: function (event) {
    wx.showModal({
      title: '解绑卡片',
      content: '你确定解绑该卡片吗',
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
            title: '正在解绑',
            icon: 'loading',
            duration: 10000,
          })
          log.info("untying card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId + ", cardName:" + cardName + ", cardId:" + cardId);
          wx.request({
            url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/card/' + cardId,
            method: "DELETE",
            data: {
              seqId: seqId,
              openId:app.globalData.openId,
              unionId:app.globalData.unionId,
              cardName:cardName
            },
            success: function (res) {
              console.log(res.data)
              wx.hideToast();
              if (res.data.errorNo == 0)
              {
                wx.showToast({
                  title: '解绑成功',
                })
                log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + "hasBindCard:" + res.data.result.hasBindCard);
                // 更新全局变量
                app.globalData.hasBindCard = res.data.result.hasBindCard;
                // 刷新
                that.setData({});
              }
              else
              {
                wx.showModal({
                  title: '解绑未成功',
                  content: '解绑不成功，请重试，如果还不成功可联系客服处理！',
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
    var formId = event.detail.formId;
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
            formId: formId,
          },
          success: function (res) {
            console.log(res.data)
            wx.hideToast();
            if (res.data.errorNo == 0) {
              wx.showToast({
                title: '挂失成功',
              })
              log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", formId:" + formId);
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
  
  
  befind:function(event){
    wx.showModal
      ({
        title: '确认收卡',
        content: '你确定已经拿到卡片了吗？',
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
              title: '正在确认',
              icon: 'loading',
              duration: 100000,
            })
            log.info("has received card: seqId:" + seqId + ", openId:" + app.globalData.openId + ", unionid:" + app.globalData.unionId + ", cardName:" + cardName + ", cardId:" + cardId);
            log.setFilterMsg(seqId);
            wx.request
              ({
                url: 'http://' + app.globalData.backIp + ':' + app.globalData.cardmgrPort + '/finder/cardmgr/receivecard/' + cardId,
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
                      title: '确认成功',
                    })
                    log.info("return res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo);
                    log.setFilterMsg(seqId);
                    // 刷新
                    that.setData({});
                  }
                  else {
                    wx.showModal({
                      title: '确认不成功',
                      content: '确认不成功，请重试，如果还不成功可联系客服处理！',
                      showCancel: false,
                      confirmText: '朕知道了',

                    })
                    log.error("确认不成功 res: seqId:" + res.data.seqId + "res.errNo:" + res.data.errorNo + ", cardName:" + cardName + ", cardId:" + cardId);
                    log.setFilterMsg(seqId);
                  }
                },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: '确认未成功',
                  content: '网络发生错误，无法确认，请稍后再试试！',
                  showCancel: false,
                  confirmText: '朕知道了',

                })
                log.error("网络不成功 确认收卡 seqId:" + seqId + ", cardName:" + cardName + ", cardId:" + cardId);
                log.setFilterMsg(seqId);
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
  untie: function (event) {
    wx.showModal
      ({
        title: '解挂卡片',
        content: '你确定已经找到卡片或者补办，而解挂该卡片吗？',
        success(res) {
          if (res.confirm) {
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
          else if (res.cancel) {

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
