import Taro from '@tarojs/taro'
import { Component } from 'react'
import { Button } from '@tarojs/components'
import '../index/index.scss';

class MyButton extends Component {

  handleClick = () => {
    // 若要跳转到非tabBar页面, 应使用Taro.navigateTo
    Taro.showToast({
      title: '敬请期待',
      icon: 'error',
      duration: 1000
    })
  }

  render(){
    return (
        <Button className={this.props.cls} onClick={this.handleClick}>
          {this.props.children}
        </Button>
    )
  }
}

export default MyButton;