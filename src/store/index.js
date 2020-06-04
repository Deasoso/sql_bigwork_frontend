import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	token: '',
}

const mutations = {
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
