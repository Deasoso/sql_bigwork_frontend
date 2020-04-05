import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
	apiurl: 'https://api.deaso40.com'
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
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
