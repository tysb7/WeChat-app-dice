// pages/dice/dices.js
// const util = require('../../utils/util.js')
Page({
  data: {
    bt: "摇",
    text: 'tomfriwel',
    x: 0,
    diceCount: 1,
    dicesData: [],
    showDialog: false, //弹框
    showCenterDialog: false,
    timeStamp_last: 0,
    timeStamp_DV: 0
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.dotsData = {
      1: "5",
      2: "28",
      3: "357",
      4: "1379",
      5: "13579",
      6: "134679"
    };
    this.timer = null;
    this.animation = wx.createAnimation({
      duration: 400,

      timingFunction: 'linear',
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    var that = this
    wx.onAccelerometerChange(function(e) {
      if (e.x > 0.8 && e.y > 0.8) {
        that.jisuan();
      }
    })
  },
  // 转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '无聊？来这里摇骰子吧～',
      path: 'pages/dices/dices',
      imageUrl: '/images/share.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  createHiddenDotData: function() {
    var dotsHidden = {};
    for (var i = 1; i <= 9; i++) {
      dotsHidden[i] = "#f6f6f6"; //空白颜色
    };
    return dotsHidden;
  },

  // 产生骰子点数
  createDotData: function() {
    var num = Math.ceil(Math.random() * 6);
    var diceData = this.dotsData[num];
    switch (diceData) {
      case '5':
        console.log("一")
        break;
      case '28':
        console.log("二")
        break;
      case '357':
        console.log("三")
        break;
      case '1379':
        console.log("四")
        break;
      case '13579':
        console.log("五")
        break;
      case '134679':
        console.log("六")
        break;
    }
    var dotsHidden = {};
    for (var i = 1; i <= 9; i++) {
      if (diceData.indexOf(i) > -1) {
        dotsHidden[i] = "#52524E"; //点数颜色
      } else {
        dotsHidden[i] = "#f6f6f6"; //空白颜色
      }
    };
    return dotsHidden;
  },

  // 产生骰子动画
  createAnim: function(left, top) {
    // 骰子移入屏幕
    this.animation.top(top + "rpx").left(left + "rpx").rotate(Math.random() * 180).step({
      duration: 1000,
      timingFunction: "ease-out"
    });
    return this.animation.export();
  },

  // 产生骰子移动终点位置
  createDicesPos: function() {
    var dicesPos = [];
    // 骰子位置判断
    function judgePos(l, t) {
      for (var j = 0; j < dicesPos.length; j++) {
        // 判断新产生的骰子位置是否与之前产生的骰子位置重叠
        if ((dicesPos[j].left - 146 < l && l < dicesPos[j].left + 146) && (dicesPos[j].top - 146 < t && t < dicesPos[j].top + 146)) {
          return false;
        }
      }
      return true;
    }
    for (var i = 0; i < this.data.diceCount; i++) {
      var posData = {},
        left = 0,
        top = 0;
      do {
        // 随机产生骰子的可能位置
        left = Math.round(Math.random() * 600); // 0~600,根据骰子区域和骰子的大小计算得出
        top = Math.round(Math.random() * 550); // 0~550,根据骰子区域和骰子的大小计算得出
      } while (!judgePos(left, top));
      posData.left = left;
      posData.top = top;
      dicesPos.push(posData);
    }
    return dicesPos;
  },

  // 设置骰子数据
  setDicesData: function(diceCount) {
    var dicesData = [];

    // 骰子动画数据
    var dicesPos = this.createDicesPos(); // 所有骰子的位置数据
    for (var i = 0; i < diceCount; i++) {
      var diceData = {};
      diceData.anim = this.createAnim(dicesPos[i].left, dicesPos[i].top);
      // diceData.dots = this.createDotData();
      diceData.dots = this.createHiddenDotData();
      dicesData.push(diceData);
    }
    this.setData({
      dicesData: dicesData
    });

  },

  dianji: function(e) {
    var dd = 0
    this.setData({
      timeStamp_DV: e.timeStamp - this.data.timeStamp_last,
      timeStamp_last: e.timeStamp
    })
    //console.log(this.data.timeStamp_DV)
    if (this.data.timeStamp_DV < 1200) {
      //console.log("成功")
      wx.showToast({
        title: '点的太快啦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.jisuan()
    }

  },

  jisuan() {
    this.setData({
      dd: +this.data.x++
    })
    //摇骰子次数
    if (0 == this.data.x % 2) {
      var bt = ""
      this.setData({
        bt: "摇"
      })
      var dicesData = this.data.dicesData;
      // 骰子动画数据
      this.createDicesPos(); // 所有骰子的位置数据
      for (var i = 0; i < this.data.diceCount; i++) {
        var diceData = {};
        diceData.dots = this.createDotData();
        dicesData[i] = diceData;
      }
      this.setData({
        dicesData: dicesData
      });
      wx.vibrateShort();
      console.log();
    } else {
      //console.log("摇")
      var bt = ""
      this.setData({
        bt: "开"
      })
      // 设置骰子移出动画
      var newData = this.data.dicesData;
      if (newData.length < this.data.diceCount) {
        for (var i = 0; i < this.data.diceCount; i++) {
          var data = {};
          newData.push(data);
        }
      }
      for (var i = 0; i < newData.length; i++) {
        this.animation.left("-233rpx").top("123rpx").rotate(-180).step();
        newData[i].anim = this.animation.export();
        this.setData({
          dicesData: newData
        });
      }
      this.timer = setTimeout(() => {
        // 骰子改变点数并移入屏幕
        this.setDicesData(this.data.diceCount);
      }, 1200);
      // 设置点击震动
      wx.vibrateShort();
    }

  },

  // 长按
  // longPress: function (e) { 
  //   var dicesData = this.data.dicesData;
  //   // 骰子动画数据
  //   this.createDicesPos(); // 所有骰子的位置数据

  //   for (var i = 0; i < this.data.diceCount; i++) {
  //     var diceData = {};
  //     diceData.dots = this.createDotData();
  //     dicesData[i] = diceData;
  //   }

  //   this.setData({ dicesData: dicesData });
  //   wx.vibrateShort();
  //   console.log(); 
  // },

  // 减少骰子数量
  reduceDice: function(e) {
    if (this.data.diceCount > 1) {
      this.setData({
        diceCount: this.data.diceCount - 1
      })
    }
  },
  // 增加骰子数量
  addDice: function() {
    if (this.data.diceCount < 9) {
      this.setData({
        diceCount: this.data.diceCount + 1
      })
    }
  },

})