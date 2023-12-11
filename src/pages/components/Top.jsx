import { Component } from "react";
import { View, Text, Button } from "@tarojs/components";
import '../index/index.scss';
import MyButton from "./MyButton";

class Top extends Component {
    render() {
        return (
            <View className = 'top'>
                <MyButton cls = 'detail'></MyButton>
                <View className = 'topCenter'>
                    <MyButton cls = 'day'>
                        <Text className = 'topText'>日</Text>
                    </MyButton>
                    <MyButton cls = 'week'>
                        <Text className = 'topText'>周</Text>
                    </MyButton>
                    <MyButton cls = 'month'>
                        <Text className = 'topText'>月</Text>
                    </MyButton>
                </View>
                <View className = 'topRight'>
                    <Button className = 'sleep' onClick={this.props.handleSleepClick}></Button>
                    <Button className = 'buffer' onClick={this.props.handleBufferClick}></Button>
                </View>
            </View>
        );
    }
}

export default Top;