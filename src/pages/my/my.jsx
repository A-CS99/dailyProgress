import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './my.scss'

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    }
  }

  handleClick = () => {
    const that = this;
    const loginUrl = 'https://uuwhat2do.org.cn:38324/dp/api/onLogin';
    // const loginUrl = 'http://localhost:5000/onLogin';
    Taro.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          Taro.request({
            url: loginUrl,
            data: {
              code: res.code
            },
            success: function (resp) {
              console.log(resp.data)
              that.setState({
                isLogin: true
              })
              Taro.setStorage({
                key: 'openid',
                data: resp.data
              })
              Taro.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='main'>
        <Button onClick={this.handleClick}>登录</Button>
      </View>
    )
  }
}
