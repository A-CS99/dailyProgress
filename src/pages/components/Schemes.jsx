import { Component } from "react";
import { ScrollView, View, Text } from "@tarojs/components";
import { SchemeForm } from "../components/SchemeForm.jsx";
import { AtFloatLayout, AtMessage } from 'taro-ui'
import '../index/index.scss';

class Schemes extends Component {

    render() {
        let children;
        if(this.props.schemes.length === 0) {
            children = (
                <View className = 'noSchemes'>
                    <Text>暂无日程安排</Text>
                    <Text>点击右下”+”添加日程</Text>
                </View>
            )
        }else{
            children = this.props.schemes.map((item, index) => {
                const date = item.start.substring(0, 10);
                const time = item.start.substring(11, 16) + '-' + item.end.substring(11, 16);
                const tid = item.tid;
                if(date === this.props.date) {
                    return(
                        <View className = 'scheme' key = {tid} onClick={(e) => this.props.handleClick(tid, e)}>
                            <View className = 'scheme-title'>{item.name}</View>
                            <View className = 'scheme-right'>
                                <View className = 'scheme-content'>{item.desc}</View>
                                <View className = 'scheme-time'>{time}</View>
                            </View>
                        </View>
                    )
                }
            })
        }
        return(
            <ScrollView className = 'schemes' scrollY scrollWithAnimation scrollTop={0}>
                {children}
            </ScrollView>
        )
    }
}

export default Schemes;