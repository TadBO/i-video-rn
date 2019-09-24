/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, useState, useRef, useEffect} from 'react';
import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import {StyleSheet, Button, Picker, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import Drawer from 'react-native-drawer';
import ActionButton from 'react-native-action-button';
import { SimpleItemsDialog } from 'react-native-pickers';
import {source} from "./utils";

const App = () => {
    // const [uri, setUrI] = useState('');
    const [selectUrI, setSelectUrI] = useState('');
    const [webUri, setWebUri] = useState('https://m.v.qq.com/');
    const [currentUrl, setCurrentUrl] = useState('');
    const [platformlist, setPlatformlist] = useState([]);
    const [list, setList] = useState([]);
    const [canGoBack, setCanGOBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const webView = new useRef(null);
    const Drawer = new useRef(null);
    useEffect(() => {
        source.getAllList().then(({data}) => {
            const {platformlist, list} = data;
            setPlatformlist(platformlist);
            setList(list);
        });
    }, []);
    // 返回
    const handleClick = () => {
        // setUrI('https://m.youku.com/');
        webView.current.goBack();
    }
    // 当视频源切换的时候
    const handleChannelChange = (index) => {
        const newList = platformlist[index];
        const { url } = newList;
        // setUrI(url);
        // 视频源切换时解析源置空
        setSelectUrI('');
        setWebUri(url);
        Drawer.current.close();
    };
    // 解析源更改时
    const handelSourceChange = (index) => {
        const newList = list[index];
        const { url } = newList;
        setSelectUrI(url);
    };
    // webview 的地址发生改变的时候，缓存当前的url,用于解析
    const handleOnLoad = (e) => {
        const { url, canGoBack, canGoForward  } = e;
        setCurrentUrl(url);
        setCanGOBack(canGoBack);
        setCanGoForward(canGoForward);
    };
    // 解析时触发
    const handleClickTitle = () => {
        // 获取当前源，是否含有解析源，含有解析源的获取播放源
        const preUrl = /\?url=/.test(currentUrl) ? currentUrl.split('?url=')[1] : currentUrl;
        const newUri = `${selectUrI}${preUrl}`;
        setWebUri(newUri);
        Drawer.current.close();
    }
    // 前进
    const handlegoClick = () => {
        webView.current.goForward();
    }
    // 打开控制页
    const handleSetting = () => {
        Drawer.current.open();
    }
    const Content = (
        <Fragment>
            <View>
                <Text>切换不同的视频源，可以找到更多你想看的内容哦~</Text>
            </View>
            <SimpleItemsDialog items={platformlist} itemKey="name" onPress={handleChannelChange} />
            {/*<Picker mode="dropdown" selectedValue={uri} onValueChange={handleChannelChange}>*/}
            {/*    {*/}
            {/*        platformlist.map((item, index) => {*/}
            {/*            return <Picker.Item key={index} label={item.name} value={item.url}/>*/}
            {/*        })*/}
            {/*    }*/}
            {/*</Picker>*/}
            <View>
                <Text>多切换几条解析源，可以提高破解几率0~</Text>
            </View>
            {/*<Picker style={{*/}
            {/*    marginTop: 10,*/}
            {/*}} mode="dropdown" selectedValue={selectUrI} onValueChange={handelSourceChange}>*/}
            {/*    {*/}
            {/*        list.map((item, index) => {*/}
            {/*            return <Picker.Item key={index} label={item.name} value={item.url}/>*/}
            {/*        })*/}
            {/*    }*/}
            {/*</Picker>*/}
            <SimpleItemsDialog items={list} itemKey="name" onPress={handelSourceChange}/>
            <Button title="破解" onPress={handleClickTitle} style={{marginTop: 10}}/>
        </Fragment>
    );
    return (
        <Fragment>
            <Drawer
                content={Content}
                ref={Drawer}
            >
                <ActionButton onPress={handleSetting} buttonColor="rgba(231,76,60,1)"></ActionButton>
                {canGoBack && <Button title="返回" onPress={handleClick} style={{marginTop: 10}}/>}
                {canGoForward &&  <Button title="前进" onPress={handlegoClick} style={{marginTop: 10}}/>}
                <WebView mixedContentMode="compatibility" allowsFullscreenVideo={true} ref={webView} source={{uri: webUri}} onNavigationStateChange={handleOnLoad}/>
            </Drawer>

        </Fragment>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    picker: {
        flex: 1,
        padding: 0,
        height: 32,
    },
    button: {
        margin: 10,
    }
});

export default App;
