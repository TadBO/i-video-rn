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
import { StyleSheet, Button, Picker } from 'react-native';
// import { WebView } from 'react-native-webview';
import WebView from 'react-native-android-fullscreen-webview-video';
import { source } from "./utils";

const App = () => {
  const [uri, setUrI] = useState('');
  const [selectUrI, setSelectUrI] = useState('');
  const [webUri, setWebUri] = useState('https://m.v.qq.com/');
  const [currentUrl, setCurrentUrl] = useState('');
  const [platformlist, setPlatformlist] = useState([]);
  const [list, setList] = useState([]);
  const webView = new useRef(null);
  useEffect(() => {
    source.getAllList().then(({data}) => {
        const { platformlist, list } = data;
        setPlatformlist(platformlist);
        setList(list);
    });
  }, []);
  const handleClick = () => {
    // setUrI('https://m.youku.com/');
    webView.current.goBack();
  }
  const handleChannelChange = (value) => {
      setUrI(value);
      setSelectUrI('');
      setWebUri(value);
  };
  const handelSourceChange = (value) => {
    setSelectUrI(value);
  };
  const handleOnLoad = (e) => {
      setCurrentUrl(e.url);
  };
  const handleClickTitle = () => {
      const preUrl = /\?url=/.test(currentUrl) ? currentUrl.split('?url=')[1]: currentUrl;
      const newUri = `${selectUrI}${preUrl}`;
      setWebUri(newUri);
  }
  return (
    <Fragment>
      <Picker  mode="dropdown" selectedValue={uri} onValueChange={handleChannelChange}>
          {
            platformlist.map((item, index) => {
              return <Picker.Item key={index} label={item.name} value={item.url} />
            })
          }
      </Picker>
      <Picker style={{
          marginTop: 10,
      }} mode="dropdown" selectedValue={selectUrI} onValueChange={handelSourceChange}>
          {
              list.map((item, index) => {
                return  <Picker.Item key={index} label={item.name} value={item.url} />
              })
          }
      </Picker>
      <Button title="破解" onPress={handleClickTitle} style={{marginTop: 10}}/>
      <Button title="返回" onPress={handleClick} style={{marginTop: 10}} />
      <WebView ref={webView} source={{uri: webUri}} onNavigationStateChange={handleOnLoad}/>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
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
