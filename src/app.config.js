export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/my/my',
  ],
  tabBar: {
    color: '#000000',
    selectedColor: '#000000',
    backgroundColor: '#F4F4F4',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/imgs/calendar.png',
        selectedIconPath: 'static/imgs/calendar.png',
        text: '日程',
      },
      {
        pagePath: 'pages/my/my',
        iconPath: 'static/imgs/my.png',
        selectedIconPath: 'static/imgs/my.png',
        text: '我的',
      }
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
