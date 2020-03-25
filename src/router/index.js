import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const pushList = r => require.ensure([], () => r(require('@/page/pushList')), 'pushList');
const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const payedList = r => require.ensure([], () => r(require('@/page/payedList')), 'payedList');
const studentList = r => require.ensure([], () => r(require('@/page/studentList')), 'studentList'); // 废弃
const lessondayList = r => require.ensure([], () => r(require('@/page/lessondayList')), 'lessondayList');
const couponList = r => require.ensure([], () => r(require('@/page/couponList')), 'couponList');

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
			path: '/pushList',
			component: pushList,
			meta: ['数据管理', '商家列表'],
		},{
			path: '/foodList',
			component: foodList,
			meta: ['数据管理', '审核列表'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['数据管理', '订单列表'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
		},{
			path: '/payedList',
			component: payedList,
			meta: ['数据管理', '已支付订单列表'],
		},{
			path: '/studentList', // 废弃
			component: studentList,
			meta: ['数据管理', '学生列表'],
		},{
			path: '/lessondayList',
			component: lessondayList,
			meta: ['数据管理', '排课列表'],
		},{
			path: '/couponList',
			component: couponList,
			meta: ['数据管理', '排课列表'],
		}
	]}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
