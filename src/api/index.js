import store from '../store/';
import axios from 'axios';
import { Message } from 'element-ui';

// var url = 'http://47.240.47.183:8991/'; // 在store/index.js里设置

const login = async function(url, port, user, password){
  console.log('http://' + url + ':' + port + '/login/');
  const k = await axios.post(
    'http://' + url + ':' + port + '/login/'
  ,{
    user: user,
    password: password
  });
  console.log(k)
  return k;
}

const query = async function(sql){
  console.log(sql);
  const k = await axios.post(
    'http://' + store.state.url + ':' + store.state.port + '/post/'
  ,{
    token: store.state.token,
    sql: sql
  });
  if(k.data.code != 200){
    Message.error('啊哦，出错了');
  }else{
    Message("成功");
  }
  return k;
}

const silentquery = async function(sql){
  // 无提示
  console.log(sql);
  const k = await axios.post(
    'http://' + store.state.url + ':' + store.state.port + '/post/'
  ,{
    token: store.state.token,
    sql: sql
  });
  return k;
}

export default {
  login,
  query,
  silentquery
}