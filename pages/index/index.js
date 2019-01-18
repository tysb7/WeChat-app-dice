//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    
  },
  onLoad: function () {

  },
  online(){
    wx.showToast({
      title: '敬请期待！',
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '无聊？来这里摇骰子吧～',
      path: 'pages/index/index',
      imageUrl: '/images/share.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  

})
