Page({
  data: {
    sortindex: 0,  //排序索引
    sortid: null,  //排序id
    tasklist: [], //任务列表
    sortlist: [],  //分类列表
    scrolltop: null, //滚动位置
    page: 0,  //分页
  },
  onLoad: function () { //加载数据渲染页面
    var that = this;
    wx.request({
      url: 'https://ai.tbw315.xyz/task',
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      data: {
        // taskType:'VOICE_ANNOTATION',
        page: 0
      },
      //获取任务列表
      success: (res) => {
        that.setData({
          sortlist: res.data.data.data,
          tasklist: res.data.data.data
        })
        that.tasklist = res.data.data.data
        console.log(that.tasklist)
      }
    })
  },

  //查看详细任务界面
  taskDetail: function (e) {
    // const d = this.data;
    const dataset = e.currentTarget.dataset;
    //将对象转为string
    var task = JSON.stringify(dataset.task)
    wx.navigateTo({
      url: '../task-detail/task-detail?task=' + task,
    })
    console.log(dataset.task)
  },
  inputSearch: function (e) {  //输入搜索文字
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value
    })
  },
  submitSearch: function () {  //提交搜索
    console.log(this.data.searchtext);
    this.fetchSortData();
  },
  //1采集任务 2标识任务 
  fetchSortData: function (e) { //获取筛选条件
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    console.log(dataset);
    this.setData({
      sortindex: dataset.findex,
    })
    var tmplist = [];
    tmplist = this.data.tasklist;
    console.log(tmplist)
    const newlist = [];
    for (var index in tmplist) {
      switch (this.data.sortindex) {
        case "1":
          if (tmplist[index].type == "VOICE_COLLECTION") {
            newlist.push(tmplist[index])
          }
          break;
        case "2":
          if (tmplist[index].type == "VOICE_ANNOTATION") {
            newlist.push(tmplist[index])
          }
          break;

      }
    }

    this.setData({
      sortlist: newlist
    })
    console.log(this.data.sortlist);
    console.log('排序索引id：' + this.data.sortindex);
  },
  user: function () {
    wx.switchTab({
      url: '../my/my',
    })
  },
  message: function () {
    wx.navigateTo({
      url: '../message/message',
    })
  },
  setStatusClass: function (e) { //设置状态颜色
    console.log(e);
  },

  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchSortData();
  },
  onPullDownRefresh: function () { //下拉刷新
    this.setData({
      page: 0,
    })
    this.fetchSortData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})

