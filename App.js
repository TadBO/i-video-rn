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
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import { Picker,  Dialog, Button,View, Text  } from 'react-native-ui-lib';
import ActionButton from 'react-native-action-button';
import {source} from "./utils";

const App = () => {
    const [visible, setVisible] = useState(false);
    const [selectUrI, setSelectUrI] = useState('');
    const [uri, setUri] = useState('https://m.v.qq.com/');
    const [webUri, setWebUri] = useState('https://m.v.qq.com/');
    const [currentUrl, setCurrentUrl] = useState('');
    const [platformlist, setPlatformlist] = useState([]);
    const [list, setList] = useState([]);
    const [canGoBack, setCanGOBack] = useState(false);
    const webView = new useRef(null);
    useEffect(() => {
        source.getAllList().then(({data}) => {
            const {platformlist, list} = data;
            setPlatformlist(platformlist);
            setList(list);
        });
    }, []);
    // 返回
    const handleClick = () => {
        const newUrl = /\?url=/.test(webUri) ? webUri.split('?url=')[1] : webUri;
        setWebUri(newUrl);
    }
    // 当视频源切换的时候
    const handleChannelChange = (e) => {
        // 视频源切换时解析源置空
        const { value } = e;
        setSelectUrI('');
        setWebUri(value);
        setUri(value);
        setVisible(false);
    };
    // 解析源更改时
    const handelSourceChange = (e) => {
        const { value } = e;
        setSelectUrI(value);
    };
    // webview 的地址发生改变的时候，缓存当前的url,用于解析
    const handleOnLoad = (e) => {
        const { url, canGoBack  } = e;
        setCurrentUrl(url);
        setCanGOBack(canGoBack);
    };
    // 解析时触发
    const handleClickTitle = () => {
        // 获取当前源，是否含有解析源，含有解析源的获取播放源
        const preUrl = /\?url=/.test(currentUrl) ? currentUrl.split('?url=')[1] : currentUrl;
        const newUri = `${selectUrI}${preUrl}`;
        setWebUri(newUri);
        setVisible(false);
    }
    // 前进
    const handlegoClick = () => {
        webView.current.goForward();
    }
    // 打开控制页
    const handleSetting = () => {
       setVisible(true);
    }
    return (
        <Fragment>
            <View style={{flex: 1}}>
                <WebView mixedContentMode="compatibility" allowsFullscreenVideo={true} ref={webView} source={{uri: webUri}} onNavigationStateChange={handleOnLoad}/>
                <ActionButton onPress={handleSetting} buttonColor="rgba(231,76,60,1)" position="left"></ActionButton>
            </View>
            <Dialog useSafeArea visible={visible} onDismiss={() => {setVisible(false)}}   height="40%">
               <View useSafeArea style={{ backgroundColor: '#fff', padding: 10}}>
                   <Text>切换不同的视频源，可以找到更多你想看的内容哦~</Text>
                   <Picker useSafeArea onChange={handleChannelChange}   style={{marginTop: 10}} value={uri} >
                       {
                           platformlist.map((item, index) => {
                               return <Picker.Item key={index} label={item.name} value={item.url} />
                           })
                       }
                   </Picker>
                   <Text>多切换几条解析源，可以提高破解几率哦~</Text>
                   <Picker useSafeArea onChange={handelSourceChange} value={selectUrI} style={{marginTop: 10}}>
                       {
                           list.map((item, index) => {
                               return <Picker.Item key={index} label={item.name} value={item.url}/>
                           })
                       }
                   </Picker>
                   <Text>选择解析源后破解哦~</Text>
                   <Button disabled={!selectUrI} label="破解" onPress={handleClickTitle} style={{marginTop: 10}}/>
                   {canGoBack && /\?url=/.test(webUri) && <Button label="返回原视频" onPress={handleClick} style={{marginTop: 10}}/>}
               </View>
            </Dialog>
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
