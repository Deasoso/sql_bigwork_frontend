import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	url: '127.0.0.1',
	port: '8991',
	token: '',
}

const mutations = {
	saveUrl(state, info){
		state.url = info;
	},
	savePort(state, info){
		state.port = info;
	},
	saveToken(state, info){
		state.token = info;
	}
}

const actions = {
	async getAdminData({commit}){
			commit('saveAdminInfo', '11');
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
