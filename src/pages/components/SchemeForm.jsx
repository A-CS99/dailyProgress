import { Component } from "react";
import { View, Form, Input, Textarea, Picker } from "@tarojs/components";
import { AtButton, AtList, AtListItem } from 'taro-ui';
import '../index/index.scss';

class SchemeForm extends Component {
  render(){
    return(
      <View className="scheme-form">
        <Form onSubmit={this.props.handleSubmit}>
          <View>
            <View className="form-hint">标题</View>
            <Input
              className="input-title"
              type="text"
              placeholder="点击输入标题"
              value={this.props.formTitle}
              onInput={this.props.handleTitleInput}
              maxlength={8}
            />
            <View className="form-hint">描述</View>
            <Textarea
              placeholder="点击输入正文"
              className="input-content"
              value={this.props.formContent}
              onInput={this.props.handleContentInput}
              maxlength={15}
            />
            <View className="input-picker">
              <Picker mode='time' value={0} onChange={this.props.onTimeChangeS}>
                <AtList>
                  <AtListItem title='开始时间' extraText={this.props.timeSel[0]} />
                </AtList>
              </Picker>
              <Picker mode='time' value={0} onChange={this.props.onTimeChangeE}>
                <AtList>
                  <AtListItem title='结束时间' extraText={this.props.timeSel[1]} />
                </AtList>
              </Picker>
            </View>
            <AtButton formType="submit" type="primary">
              提交
            </AtButton>
          </View>
        </Form>
      </View>
    )
  }
}

export default SchemeForm;