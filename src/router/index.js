import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const bookList = r => require.ensure([], () => r(require('@/page/bookList')), 'bookList');

const routes = [
	{
		path: '/',
		component: manage
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/userList',
			component: userList,
			meta: ['数据管理', '用户列表'],
		},{
			path: '/bookList',
			component: bookList,
			meta: ['数据管理', '书本列表'],
		}
	]}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
