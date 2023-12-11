import { Component } from "react";
import { View, Text } from "@tarojs/components";
import MyButton from "./MyButton";
import '../index/index.scss';

class Menu extends Component {

    render() {
        const sleep = this.props.sleep;
        const buffer = this.props.buffer;
        const total = 24*60;
        const buzyTime = this.props.buzyTime;
        const leisure = total - sleep - buffer - buzyTime;
        let bufferTxt = '';
        let leisureTxt = '';
        if (buffer < 60) {
            bufferTxt = `0h${buffer}min`;
        } else {
            bufferTxt = `${Math.floor(buffer / 60)}h${buffer % 60}min`;
        }
        if (leisure < 60) {
            leisureTxt = `0h${leisure}min`;
        } else {
            leisureTxt = `${Math.floor(leisure / 60)}h${leisure % 60}min`;
        }
        return(
            <View className = 'menu'>
                <View className = 'date'>
                    <Text className = 'dateText'>{this.props.date}</Text>
                    <MyButton cls = 'dateMore'></MyButton>
                </View>
                <View className = 'remains'>
                    <Text className = 'remainsText'>{`缓冲时间：${bufferTxt}`}</Text>
                    <Text className = 'remainsText'>{`空闲时间：${leisureTxt}`}</Text>
                </View>
                <View className = 'countBar'>
                    <View className = 'data'>
                        <Text className = 'dataNum'>{this.props.total}</Text>
                        <Text className = 'dataText'>总计</Text>
                    </View>
                    <View className = 'data'>
                        <Text className = 'dataNum'>{this.props.wait}</Text>
                        <Text className = 'dataText'>待办</Text>
                    </View>
                    <View className = 'data' style='border: none;'>
                        <Text className = 'dataNum'>{this.props.star}</Text>
                        <Text className = 'dataText'>星标</Text>
                    </View>
                </View>
                <View className= "bgImg"></View>
            </View>
        )
    }
}

export default Menu;