import store from '../store/';
import axios from 'axios';
import { Message } from 'element-ui';

var url = 'http://localhost:8991/';

const login = async function(){
  console.log(url + 'login/');
  const k = await axios.post(
    url + 'login/'
  ,{
    user: 'admin',
    password: '123999'
  });
  console.log(k)
  store.commit('saveToken', k.data.token)
}

const query = async function(sql){
  console.log(sql);
  const k = await axios.post(
    url + 'post/'
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

export default {
  login,
  query
}