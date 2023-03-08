import { Component } from "react";
import { View, Text } from "@tarojs/components";
import MyButton from "./MyButton";
import '../index/index.scss';

class Menu extends Component {
    constructor(props) { 
        super(props);
        this.state = {
            date: '',
            flush: '0h0min',
            leisure: '0h0min',
        }
    }

    componentWillMount () {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const week = date.getDay();
        let weekStr = '';
        switch(week) {
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
            date: `${month}月${day}日 周${weekStr}`,
        })
    }

    render() {
        return(
            <View className = 'menu'>
                <View className = 'date'>
                    <Text className = 'dateText'>{this.state.date}</Text>
                    <MyButton cls = 'dateMore'></MyButton>
                </View>
                <View className = 'remains'>
                    <Text className = 'remainsText'>{`缓冲时间：${this.state.flush}`}</Text>
                    <Text className = 'remainsText'>{`空闲时间：${this.state.leisure}`}</Text>
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