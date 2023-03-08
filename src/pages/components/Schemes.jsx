import { Component } from "react";
import { View, Text } from "@tarojs/components";
import '../index/index.scss';

class Schemes extends Component {

    componentWillMount() { }
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
                return(
                    <View className = 'scheme' key = {index}>
                        <View className = 'scheme-title'>{item.title}</View>
                        <View className = 'scheme-right'>
                            <View className = 'scheme-content'>{item.content}</View>
                            <View className = 'scheme-time'>{item.time}</View>
                        </View>
                    </View>
                )
            })
        }
        return(
            <View className = 'schemes'>
                {children}
            </View>
        )
    }
}

export default Schemes;