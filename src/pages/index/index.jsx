import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Button, Form, Picker } from '@tarojs/components'
import Top from '../components/Top.jsx'
import Menu from '../components/Menu.jsx'
import Schemes from '../components/Schemes.jsx'
import SchemeForm from '../components/SchemeForm.jsx'
import { AtFloatLayout, AtMessage, AtButton, AtList, AtListItem } from 'taro-ui'
import './index.scss'
import { stringify } from 'postcss'


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schemes: [],
      isFormOpen: false,
      isOptionOpen: false,
      isEditOpen: false,
      isSleepOpen: false,
      isBufferOpen: false,
      chosenTask: 0,
      formTitle: '',
      formContent: '',
      selectTime: ['00:00', '00:00'],
      buzyTime: 0,
      date: '',
      dateText: '',
      sleep: 0,
      sleepTime: ['00:00', '00:00'],
      buffer: 0,
      bufferTime: '00:00',
      total: 0,
      wait: 0,
      star: 0,
    };
  }

  countBizyTime = (item) => {
    let buzyTime = 0;
    const sH = parseInt(item.start.split('T')[1].split(':')[0]);
    const sM = parseInt(item.start.split('T')[1].split(':')[1]);
    const eH = parseInt(item.end.split('T')[1].split(':')[0]);
    const eM = parseInt(item.end.split('T')[1].split(':')[1]);
    let dH = 0;
    let dM = 0;
    if (eH > sH) {
      dH = eH - sH;
      if(eM >= sM) {
        dM = eM - sM;
      } else {
        dH -= 1;
        dM = 60 - sM + eM;
      }
    } else {
      dH = 24 - sH + eH;
      if(eM >= sM) {
        dM = eM - sM;
      } else {
        dH -= 1;
        dM = 60 - sM + eM;
      }
    }
    buzyTime = dH * 60 + dM;
    return buzyTime;
  }

  //此处修改为自己的服务器地址
  myUrl = 'https://uuwhat2do.org.cn:38324/dp/api';
  // myUrl = 'http://localhost:5000';

  // 新建日程
  handleBtnClick = () => {
    this.setState({
      isFormOpen: true,
    })
  }

  handleFormClose = () => {
    this.setState({
      isFormOpen: false,
      formTitle: '',
      formContent: '',
      selectTime: ['00:00', '00:00'],
    })
  }

  handleNewSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    const { formTitle, formContent } = this.state;
    let selectTime = this.state.selectTime;
    let buzyTime = this.state.buzyTime;
    let dH = 0;
    let dM = 0;
    const sH = parseInt(selectTime[0].split(':')[0]);
    const sM = parseInt(selectTime[0].split(':')[1]);
    const eH = parseInt(selectTime[1].split(':')[0]);
    const eM = parseInt(selectTime[1].split(':')[1]);
    if (eH > sH) {
      dH = eH - sH;
      if(eM >= sM) {
        dM = eM - sM;
      } else {
        dH -= 1;
        dM = 60 - sM + eM;
      }
    } else {
      dH = 24 - sH + eH;
      if(eM >= sM) {
        dM = eM - sM;
      } else {
        dH -= 1;
        dM = 60 - sM + eM;
      }
    }
    buzyTime += dH * 60 + dM;
    selectTime[0] = `${year}-${month}-${day}T${selectTime[0]}:00`;
    selectTime[1] = `${year}-${month}-${day}T${selectTime[1]}:00`;
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
      let wid = '';
      let tid = 0;
      const that = this;
      Taro.getStorage({
        key: 'openid',
        success: (res) => {
          wid = res.data;
          Taro.request({
            url: that.myUrl + '/task',
            method: 'POST',
            data: JSON.stringify({
              wid: wid,
              name: formTitle,
              desc: formContent,
              start: selectTime[0],
              end: selectTime[1]
            }),
            header: {
              'content-type': 'application/json'
            },
            success: (res) => {
              tid = res.data.tid;
              this.setState({
                isFormOpen: false,
                schemes: [...this.state.schemes, { tid: tid, name: formTitle, desc: formContent, start: selectTime[0], end: selectTime[1] }],
                buzyTime: buzyTime,
                total: this.state.total + 1,
                wait: this.state.wait + 1,
              })
              Taro.setStorage({
                key: 'buzyTime',
                data: buzyTime
              })
            },
            fail: () => {
              Taro.atMessage({
                'message': '请先登录',
                'type': 'error',
              })
            }
          })
        }
      })
    }
  }

  handleTitleInput = (e) => {
    e.preventDefault();
    this.setState({
      formTitle: e.target.value,
    })
  }

  handleContentInput = (e) => {
    e.preventDefault();
    this.setState({
      formContent: e.target.value,
    })
  }

  handleTimeChangeS = (e) => {
    e.preventDefault();
    this.setState({
      selectTime: [e.detail.value, this.state.selectTime[1]],
    })
  }

  handleTimeChangeE = (e) => {
    e.preventDefault();
    this.setState({
      selectTime: [this.state.selectTime[0], e.detail.value],
    })
  }

  //编辑/删除任务
  handleSchemeClick = (tid, e) => {
    e.preventDefault();
    console.log(tid);
    this.setState({
      isOptionOpen: true,
      chosenTask: tid
    })
  }

  handleOptionClose = () => {
    this.setState({
      isOptionOpen: false,
    })
  }

  handleDeleteClick = () => {
    this.setState({
      isOptionOpen: false,
    })
    const { chosenTask, schemes } = this.state;
    let buzyTime = this.state.buzyTime;
    let newSchemes = schemes.filter((item) => {
      if (item.tid === chosenTask) {
        const sH = parseInt(item.start.split('T')[1].split(':')[0]);
        const sM = parseInt(item.start.split('T')[1].split(':')[1]);
        const eH = parseInt(item.end.split('T')[1].split(':')[0]);
        const eM = parseInt(item.end.split('T')[1].split(':')[1]);
        let dH = 0;
        let dM = 0;
        if (eH > sH) {
          dH = eH - sH;
          if(eM >= sM) {
            dM = eM - sM;
          } else {
            dH -= 1;
            dM = 60 - sM + eM;
          }
        } else {
          dH = 24 - sH + eH;
          if(eM >= sM) {
            dM = eM - sM;
          } else {
            dH -= 1;
            dM = 60 - sM + eM;
          }
        }
        buzyTime -= dH * 60 + dM;
      }
      return item.tid !== chosenTask;
    })
    this.setState({
      schemes: newSchemes,
      buzyTime: buzyTime,
      total: this.state.total - 1,
      wait: this.state.wait - 1,
    })
    Taro.request({
      url: this.myUrl + '/task',
      method: 'DELETE',
      data: JSON.stringify({ tid: chosenTask }),
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res);
      }
    })
  }

  handleEditClick = () => {
    const scheme = this.state.schemes.filter((item) => {
      return item.tid === this.state.chosenTask;
    })
    this.setState({
      isOptionOpen: false,
      isEditOpen: true,
      formTitle: scheme[0].name,
      formContent: scheme[0].desc,
      selectTime: [scheme[0].start.slice(11, 16), scheme[0].end.slice(11, 16)]
    })
  }

  handleEditClose = () => {
    this.setState({
      isEditOpen: false,
      formTitle: '',
      formContent: '',
      selectTime: ['00:00', '00:00'],
    })
  }


  handleEditSubmit = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    const { formTitle, formContent, chosenTask } = this.state;
    let selectTime = this.state.selectTime;
    selectTime[0] = `${year}-${month}-${day}T${selectTime[0]}:00`;
    selectTime[1] = `${year}-${month}-${day}T${selectTime[1]}:00`;
    let diff = 0;
    const newSchemes = this.state.schemes.map((item) => {
      if (item.tid === chosenTask) {
        item.name = formTitle;
        item.desc = formContent;
        diff = this.countBizyTime(item);
        item.start = selectTime[0];
        item.end = selectTime[1];
        diff = this.countBizyTime(item) - diff;
      }
      return item;
    })
    this.setState({
      isEditOpen: false,
      schemes: newSchemes,
      buzyTime: this.state.buzyTime + diff,
    })
    Taro.request({
      url: this.myUrl + '/task',
      method: 'PATCH',
      data: JSON.stringify({
        tid: chosenTask,
        name: formTitle,
        desc: formContent,
        start: selectTime[0],
        end: selectTime[1],
        status: 0
      }),
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res);
      }
    })
  }

  //设置睡眠时间
  handleSleepClick = () => {
    this.setState({
      isSleepOpen: true,
    })
  }

  handleSleepClose = () => {
    this.setState({
      isSleepOpen: false,
    })
  }

  handleSleepChangeS = (e) => {
    e.preventDefault();
    this.setState({
      sleepTime: [e.detail.value, this.state.sleepTime[1]],
    })
  }

  handleSleepChangeE = (e) => {
    e.preventDefault();
    this.setState({
      sleepTime: [this.state.sleepTime[0], e.detail.value],
    })
  }

  handleSleepSubmit = () => {
    const { sleepTime } = this.state;
    let wid = '';
    const that = this;
    let sleep = 0;
    if (sleepTime[0] > sleepTime[1]) {
      sleep = 60 * (24 - parseInt(sleepTime[0].slice(0, 2)) + parseInt(sleepTime[1].slice(0, 2))) + parseInt(sleepTime[1].slice(3, 5)) - parseInt(sleepTime[0].slice(3, 5));
    } else {
      sleep = 60 * (parseInt(sleepTime[1].slice(0, 2)) - parseInt(sleepTime[0].slice(0, 2))) + parseInt(sleepTime[1].slice(3, 5)) - parseInt(sleepTime[0].slice(3, 5));
    }
    this.setState({
      isSleepOpen: false,
      sleep: sleep
    })
    Taro.getStorage({
      key: 'openid',
      success: (res) => {
        wid = res.data;
        Taro.request({
          url: that.myUrl + '/sleep',
          method: 'POST',
          data: JSON.stringify({
            wid: wid,
            start: sleepTime[0],
            end: sleepTime[1]
          }),
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            console.log(res);
          }
        })
      }
    })
  }

  //设置缓冲时间
  handleBufferClick = () => {
    this.setState({
      isBufferOpen: true,
    })
  }

  handleBufferClose = () => {
    this.setState({
      isBufferOpen: false,
    })
  }

  handleBufferChange = (e) => {
    e.preventDefault();
    this.setState({
      bufferTime: e.detail.value,
    })
  }

  handleBufferSubmit = () => {
    const { bufferTime } = this.state;
    let wid = '';
    const that = this;
    const buffer = parseInt(bufferTime.slice(0, 2)) * 60 + parseInt(bufferTime.slice(3, 5));

    this.setState({
      isBufferOpen: false,
      buffer: buffer,
      bufferTime: bufferTime
    })
    Taro.getStorage({
      key: 'openid',
      success: (res) => {
        wid = res.data;
        Taro.request({
          url: that.myUrl + '/buffer',
          method: 'POST',
          data: JSON.stringify({
            wid: wid,
            buffer: bufferTime
          }),
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            console.log(res);
          }
        })
      } 
    })
  }



  componentWillMount() {
    //获取当前日期
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let _month = month;
    if (month < 10) _month = '0' + month;
    const day = date.getDate();
    let _day = day;
    if (day < 10) _day = '0' + day;
    const week = date.getDay();
    let weekStr = '';
    switch (week) {
      case 1:
        weekStr = '一';
        break;
      case 2:
        weekStr = '二';
        break;
      case 3:
        weekStr = '三';
        break;
      case 4:
        weekStr = '四';
        break;
      case 5:
        weekStr = '五';
        break;
      case 6:
        weekStr = '六';
        break;
      case 0:
        weekStr = '日';
        break;
    }
    this.setState({
      date: `${year}-${_month}-${_day}`,
      dateText: `${month}月${day}日 周${weekStr}`,
    })

    //获取任务列表
    let wid = '';
    Taro.getStorage({
      key: 'openid',
      success: (res) => {
        wid = res.data;
        Taro.request({
          url: this.myUrl + '/name',
          method: 'POST',
          data: JSON.stringify({ wid: wid, name: 'test' }),
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            console.log(res.data);
          }
        })
      },
      fail: () => {
        Taro.atMessage({
          'message': '请先登录',
          'type': 'error',
        })
      },
      complete: () => {
        Taro.request({
          url: this.myUrl + '/task',
          method: 'GET',
          data: { wid: wid },
          success: (res) => {
            console.log(res.data);
            this.setState({
              schemes: [...this.state.schemes, ...res.data],
              total: res.data.length,
              wait: res.data.length,
            })
          }
        })
        Taro.request({
          url: this.myUrl + '/sleep',
          method: 'GET',
          data: { wid: wid },
          success: (res) => {
            console.log(res.data);
            const sleepTime = [res.data.start, res.data.end];
            let sleep = 0;
            if (sleepTime[0] > sleepTime[1]) {
              sleep = 60 * (24 - parseInt(sleepTime[0].slice(0, 2)) + parseInt(sleepTime[1].slice(0, 2))) + parseInt(sleepTime[1].slice(3, 5)) - parseInt(sleepTime[0].slice(3, 5));
            } else {
              sleep = 60 * (parseInt(sleepTime[1].slice(0, 2)) - parseInt(sleepTime[0].slice(0, 2))) + parseInt(sleepTime[1].slice(3, 5)) - parseInt(sleepTime[0].slice(3, 5));
            }
            this.setState({
              sleep: sleep,
              sleepTime: sleepTime
            })
          }
        })
        Taro.request({
          url: this.myUrl + '/buffer',
          method: 'GET',
          data: { wid: wid },
          success: (res) => {
            console.log(res.data);
            const bufferTime = res.data.buffer;
            const buffer = parseInt(bufferTime.slice(0, 2)) * 60 + parseInt(bufferTime.slice(3, 5));
            this.setState({
              buffer: buffer,
              bufferTime: bufferTime
            })
          }
        })
      }
    })
    Taro.getStorage({
      key: 'buzyTime',
      success: (res) => {
        this.setState({
          buzyTime: res.data
        })
      }
    })
  }

  componentDidMount() { }

  render() {
    return (
      <View className='main'>
        <AtMessage />
        <Top handleSleepClick={this.handleSleepClick} handleBufferClick={this.handleBufferClick}/>
        <View className='mainContainer'>
          <Menu date={this.state.dateText} sleep={this.state.sleep} buffer={this.state.buffer} buzyTime={this.state.buzyTime} total={this.state.total} wait={this.state.wait} star={this.state.star} />
          <Schemes date={this.state.date} schemes={this.state.schemes} handleClick={(tid, e) => this.handleSchemeClick(tid, e)} />
        </View>
        <AtFloatLayout
          isOpened={this.state.isFormOpen}
          title="新建日程"
          onClose={this.handleFormClose} >
          <SchemeForm
            formTitle={this.state.formTitle}
            formContent={this.state.formContent}
            handleSubmit={e => this.handleNewSubmit(e)}
            handleTitleInput={e => this.handleTitleInput(e)}
            handleContentInput={e => this.handleContentInput(e)}
            onTimeChangeS={e => this.handleTimeChangeS(e)}
            onTimeChangeE={e => this.handleTimeChangeE(e)}
            timeSel={this.state.selectTime} />
        </AtFloatLayout>
        <AtFloatLayout
          isOpened={this.state.isOptionOpen}
          title="选项"
          onClose={this.handleOptionClose} >
          <AtButton formType="submit" type="primary" onClick={this.handleEditClick}>编辑</AtButton>
          <AtButton className='deleteBtn' formType="submit" type="primary" onClick={this.handleDeleteClick}>删除</AtButton>
        </AtFloatLayout>
        <AtFloatLayout
          isOpened={this.state.isEditOpen}
          title="编辑日程"
          onClose={this.handleEditClose} >
          <SchemeForm
            formTitle={this.state.formTitle}
            formContent={this.state.formContent}
            handleSubmit={e => this.handleEditSubmit(e)}
            handleTitleInput={e => this.handleTitleInput(e)}
            handleContentInput={e => this.handleContentInput(e)}
            onTimeChangeS={e => this.handleTimeChangeS(e)}
            onTimeChangeE={e => this.handleTimeChangeE(e)}
            timeSel={this.state.selectTime} />
        </AtFloatLayout>
        <AtFloatLayout
          isOpened={this.state.isSleepOpen}
          title="设置睡眠时间"
          onClose={this.handleSleepClose} >
          <Form onSubmit={this.handleSleepSubmit}>
            <View className="input-picker">
              <Picker mode='time' value={0} onChange={e => this.handleSleepChangeS(e)}>
                <AtList>
                  <AtListItem title='开始时间' extraText={this.state.sleepTime[0]} />
                </AtList>
              </Picker>
              <Picker mode='time' value={0} onChange={e => this.handleSleepChangeE(e)}>
                <AtList>
                  <AtListItem title='结束时间' extraText={this.state.sleepTime[1]} />
                </AtList>
              </Picker>
            </View>
            <AtButton formType="submit" type="primary">提交</AtButton>
          </Form>
        </AtFloatLayout>
        <AtFloatLayout
          isOpened={this.state.isBufferOpen}
          title="设置睡眠时间"
          onClose={this.handleBufferClose} >
          <Form onSubmit={this.handleBufferSubmit}>
            <View className="input-picker">
              <Picker mode='time' value={0} onChange={e => this.handleBufferChange(e)}>
                <AtList>
                  <AtListItem title='缓冲时间' extraText={this.state.bufferTime} />
                </AtList>
              </Picker>
            </View>
            <AtButton formType="submit" type="primary">提交</AtButton>
          </Form>
        </AtFloatLayout>
        <Button className='btn' onClick={this.handleBtnClick}></Button>
      </View>
    )
  }
}

export default Index;
