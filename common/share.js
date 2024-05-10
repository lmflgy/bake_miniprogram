export default {
    onShareTimeline: function (res) {
      var that = this;
      return {
        title: `more to luv生日蛋糕`,
        // imageUrl: `https://bbs.txwb.com/images/wmapp/share.jpg`,
        query: "",
        success: function (res) { },
      };
    },
    onShareAppMessage: function (res) {
      return {
        title: `more to luv生日蛋糕`,
        // imageUrl: `https://bbs.txwb.com/images/wmapp/share.jpg`,
        path: "/pages/index/index" ,
        success: function (res) { },
      };
    },
}
