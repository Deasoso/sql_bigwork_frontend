<template>
    <div class="header_container">

		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-button type="primary" style="margin-right:10px;">登录</el-button>
    </div>
</template>

<script>
	import {mapActions, mapState} from 'vuex'

    export default {
    	data(){
    		return {

    		}
    	},
    	created(){

    	},
    	computed: {

    	},
			methods: {

			}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
		text-align: center;
	}
</style>
