const SCREENINFO = 'screenInfo'
const LOGIN = 'login'
const SETLOGIN = 'SetLogin'
const SETCART='SetCart'
const SETORDER='SetOrder'
const SETPAYMENT='SetPayment'
import http from '@/utils/http.js'
const store = {
	state: {
		screenHeight: 0,
		statusBarHeight: 0,
		userInfo: uni.getStorage('userInfo') || {}, // 用户信息
		isLogin: false ,// 登录弹出框
		isCart:false,//购物车
		isOrder:false,//订单
		isPayment:false,//付款
	},
	mutations: {
		[SCREENINFO](state, data) {
			uni.getSystemInfo({
				success: (res) => {
					state.screenHeight = res.windowHeight
					state.statusBarHeight = res.statusBarHeight
				}
			})
		},
		[LOGIN](state, data) {
			state.userInfo = data
		},
		[SETLOGIN](state, data) {
			state.isLogin = data
		},
		[SETCART](state, data) {
			state.isCart = data
		},
		[SETORDER](state, data) {
			state.isOrder = data
		},
		[SETPAYMENT](state, data) {
			state.isPayment = data
		}
	},
	actions: {
		async login({
			commit
		}, data) {
			let _self = this;
			try {
				// debugger
				
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	getters: {
		screenHeight(state){
			return state.screenHeight
		},
		statusBarHeight(state){
			return state.statusBarHeight
		},
		userInfo(state) {
			return state.userInfo
		},
		isLogin(state){
			return state.isLogin
		},
		isCart(state){
			return state.isCart
		},
		isOrder(state){
			return state.isOrder
		},
		isPayment(state){
			return state.isPayment
		}
	}
}
export default store
