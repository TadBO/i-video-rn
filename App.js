/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, useState, useRef, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import { Picker,  Dialog, Button,View, Text, Toast  } from 'react-native-ui-lib';
import ActionButton from 'react-native-action-button';
import {source} from "./utils";

const App = () => {
    const [visible, setVisible] = useState(false);
    const [selectUrI, setSelectUrI] = useState('');
    const [channelValue, setChannelValue] = useState({});
    const [sourceValue, setSourceValue] = useState({});
    const [webUri, setWebUri] = useState('https://m.v.qq.com/');
    const [currentUrl, setCurrentUrl] = useState('');
    const [platformlist, setPlatformlist] = useState([]);
    const [list, setList] = useState([]);
    const [canGoBack, setCanGOBack] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const webView = new useRef(null);
    useEffect(() => {
        source.getAllList().then(({data}) => {
            const {platformlist, list} = data;
            setPlatformlist(platformlist);
            setList(list);
            // 设置初始值
            const channel = platformlist[0];
            setChannelValue({ label: channel.name, value: channel.url});
            const sourse = list[0];
            setSourceValue({label: sourse.name, value: sourse.url});
        });
    }, []);
    // 返回源视频
    const handleClick = () => {
        const newUrl = /\?url=/.test(currentUrl) ? currentUrl.split('?url=')[1] : currentUrl;
        setWebUri(newUrl);
    }
    // 当视频源切换的时候
    const handleChannelChange = (e) => {
        // 视频源切换时解析源置空
        const { value } = e;
        setSelectUrI('');
        setWebUri(value);
        setVisible(false);
        setChannelValue(e);
    };
    // 解析源更改时
    const handelSourceChange = (e) => {
        const { value } = e;
        setSelectUrI(value);
        setSourceValue(e);
    };
    // webview 的地址发生改变的时候，缓存当前的url,用于解析
    const handleOnLoad = (e) => {
        const { url, canGoBack  } = e;
        setCurrentUrl(/\?url=/.test(url) ? url.split('?url=')[1] : url);
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
    // 打开控制页
    const handleSetting = () => {
       setVisible(true);
    }
    // 打开页面失败后处理
    const handleErrorEvent = () => {
      setShowToast(true);
    }
    return (
        <Fragment>
            <View style={{flex: 1}}>
                <WebView mixedContentMode="compatibility" allowsFullscreenVideo={true} ref={webView} source={{uri: webUri}} onNavigationStateChange={handleOnLoad} onError={handleErrorEvent}/>
                <ActionButton onPress={handleSetting} buttonColor="rgba(231,76,60,1)" position="left"></ActionButton>
            </View>
            <Dialog useSafeArea visible={visible} onDismiss={() => {setVisible(false)}}   height="40%">
               <View useSafeArea style={{ backgroundColor: '#fff', padding: 10}}>
                   <Text>切换不同的视频源，可以找到更多你想看的内容哦~</Text>
                   <Picker useSafeArea onChange={handleChannelChange}   style={{marginTop: 10}} value={channelValue} >
                       {
                           platformlist.map((item, index) => {
                               return <Picker.Item key={index} label={item.name} value={item.url} />
                           })
                       }
                   </Picker>
                   <Text>多切换几条解析源，可以提高破解几率哦~</Text>
                   <Picker useSafeArea onChange={handelSourceChange} value={sourceValue} style={{marginTop: 10}}>
                       {
                           list.map((item, index) => {
                               return <Picker.Item key={index} label={item.name} value={item.url}/>
                           })
                       }
                   </Picker>
                   <Text>选择想看的视频和解析源后再破解哦~</Text>
                   <Button disabled={!selectUrI} label="破解" onPress={handleClickTitle} style={{marginTop: 10}}/>
                   {canGoBack && /\?url=/.test(webUri) && <Button label="返回原视频" onPress={handleClick} style={{marginTop: 10}}/>}
               </View>
            </Dialog>
            <Toast
                visible={showToast}
                message='解析失败,请重新选择'
                position={'top'}
                centerMessage
                actions={[
                    {label: '我知道了', onPress: () => setShowToast(false)},
                ]}
            />
        </Fragment>
    );
};

export default App;
