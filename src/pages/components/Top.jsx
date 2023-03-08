import { Component } from "react";
import { View, Text } from "@tarojs/components";
import '../index/index.scss';
import MyButton from "./MyButton";

class Top extends Component {
    render() {
        return (
            <View className = 'top'>
                <MyButton cls = 'detail' toTab={true} path='../my/my'></MyButton>
                <View className = 'topCenter'>
                    <MyButton cls = 'day' toTab={true} path='../my/my'>
                        <Text className = 'topText'>日</Text>
                    </MyButton>
                    <MyButton cls = 'week' toTab={true} path='../my/my'>
                        <Text className = 'topText'>周</Text>
                    </MyButton>
                    <MyButton cls = 'month' toTab={true} path='../my/my'>
                        <Text className = 'topText'>月</Text>
                    </MyButton>
                </View>
                <View className = 'topRight'>
                    <MyButton cls = 'sleep' toTab={true} path='../my/my'></MyButton>
                    <MyButton cls = 'leisure' toTab={true} path='../my/my'></MyButton>
                </View>
            </View>
        );
    }
}

export default Top;