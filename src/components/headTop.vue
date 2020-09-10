<template>
	<div class="header_container">

		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>

		<el-button v-if="$store.state.token == ''" type="primary" @click="dialogFormVisible=true" style="margin-right:10px;">登录</el-button>
		<el-button v-else type="primary" plain disabled style="margin-right:10px;">已登录</el-button>

		<el-dialog title="登录" :visible.sync="dialogFormVisible">
			<el-input placeholder="请输入内容" v-model="input1" style="margin:5px;">
				<template slot="prepend">ip地址</template>
			</el-input>
			<el-input placeholder="请输入内容" v-model="input2" style="margin:5px;">
				<template slot="prepend">端口</template>
			</el-input>
			<el-input placeholder="请输入内容" v-model="input3" style="margin:5px;">
				<template slot="prepend">用户名</template>
			</el-input>
			<el-input placeholder="请输入内容" type="password" v-model="input4" style="margin:5px;">
				<template slot="prepend">密码</template>
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="login()">登 录</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import api from "../api";
	import {mapActions, mapState} from 'vuex'

    export default {
    	data(){
    		return {
					dialogFormVisible: false,
					input1: '47.240.47.183',
					input2: '8991',
					input3: 'admin',
					input4: '',
    		}
    	},
    	created(){

    	},
    	computed: {

    	},
			methods: {
				async login(){
					const k = await api.login(this.input1, this.input2, this.input3, this.input4);
					if(k.data.code != 200){
						this.$message.error('登录失败');
					}else{
						this.$message("登录成功");
						this.$store.commit('saveToken', k.data.token)
						this.$store.commit('saveUrl', this.input1)
						this.$store.commit('savePort', this.input2)
						this.dialogFormVisible = false;
					}
				}
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
