import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Button } from '@tarojs/components'
import Top from '../components/Top.jsx'
import Menu from '../components/Menu.jsx'
import Schemes from '../components/Schemes.jsx'
import SchemeForm from '../components/SchemeForm.jsx'
import { AtFloatLayout, AtMessage } from 'taro-ui'
import './index.scss'
import { stringify } from 'postcss'


class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      schemes: [],
      isFormOpen: false,
      formTitle: '',
      formContent: '',
      selectTime: ['00:00', '00:00'],
      total: 0,
      wait: 0,
      star: 0,
    };
  }

  //此处修改为自己的服务器地址
  setUrl = 'http://127.0.0.1:5000/setSchemes';
  getUrl = 'http://127.0.0.1:5000/getSchemes';

  handleBtnClick = () => {
    this.setState({
      isFormOpen: true,
      formTitle: '',
      formContent: '',
    })
  }

  handleFormClose = () => {
    this.setState({
      isFormOpen: false,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { formTitle, formContent } = this.state;
    if (formTitle === '' || formContent === '') {
      Taro.atMessage({
        'message': '标题或描述不能为空',
        'type': 'error',
      })
    } else {
      Taro.atMessage({
        'message': '提交成功',
        'type': 'success',
      })
      this.setState({
        isFormOpen: false,
        schemes: [...this.state.schemes, {title: this.state.formTitle, content: this.state.formContent, time: this.state.selectTime[0] + '-' + this.state.selectTime[1]}],
        total: this.state.total + 1,
        wait: this.state.wait + 1,
      })
      setTimeout(() => {
        let user = '';
        const that = this;
        Taro.getStorage({
          key: 'openid',
          success: (res) => {
            user = res.data;
            Taro.request({
              url: that.setUrl,
              method: 'POST',
              data: JSON.stringify({
                user: user,
                scheme: {
                  title: that.state.formTitle,
                  content: that.state.formContent,
                  time: that.state.selectTime[0] + '-' + that.state.selectTime[1]
                }
              }),
              header: {
                'content-type': 'application/json'
              }
            })
          }
        })
        
      }, 1000);
    }
  }

  handleTitleInput = (e) => {
    this.setState({
      formTitle: e.target.value,
    })
  }

  handleContentInput = (e) => {
    this.setState({
      formContent: e.target.value,
    })
  }

  handleTimeChangeS = (e) => {
    this.setState({
      selectTime: [e.detail.value, this.state.selectTime[1]],
    })
  }

  handleTimeChangeE = (e) => {
    this.setState({
      selectTime: [this.state.selectTime[0], e.detail.value],
    })
  }

  componentWillMount () {
    let user = '';
    Taro.getStorage({
      key: 'openid',
      success: (res) => {
        user = res.data;
      },
      complete: () => {
        Taro.request({
          url: this.getUrl,
          method: 'GET',
          data: {user: user},
          success: (res) => {
            console.log(res.data);
            this.setState({
              schemes: [...this.state.schemes, ...res.data],
              total: res.data.length,
              wait: res.data.length,
            })
          }
        })
      }
    })
  }

  componentDidMount () { }

  render () {
    return (
      <View className='main'>
        <AtMessage />
        <Top />
        <Menu total={this.state.total} wait={this.state.wait} star={this.state.star}/>
        <Schemes schemes={this.state.schemes}/>
        <AtFloatLayout
          isOpened={this.state.isFormOpen}
          title="新建日程"
          onClose={this.handleFormClose} >
          <SchemeForm
            formTitle={this.state.formTitle}
            formContent={this.state.formContent}
            handleSubmit={e => this.handleSubmit(e)}
            handleTitleInput={e => this.handleTitleInput(e)}
            handleContentInput={e => this.handleContentInput(e)}
            onTimeChangeS={e => this.handleTimeChangeS(e)}
            onTimeChangeE={e => this.handleTimeChangeE(e)}
            timeSel={this.state.selectTime} />
        </AtFloatLayout>
        <Button className='btn' onClick={this.handleBtnClick}></Button>
      </View>
    )
  }
}

export default Index;
