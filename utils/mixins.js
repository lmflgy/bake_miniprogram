// import {
// 	mapMutations,
// 	mapActions,
// 	mapGetters
// } from 'vuex';
// const MD5 = require('./MD16')
// export const currRouteMixin = {
// 	data() {
// 		return {
// 			currRoute: ''
// 		}
// 	},
// 	onShow() {
// 		this.getRouter()
// 	},
// 	methods: {
// 		getRouter() {
// 			let routes = getCurrentPages();
// 			let curRoute = routes[routes.length - 1].route
// 			this.currRoute = curRoute
// 		}
// 	}
// }
// export const loginMixin = {
// 	data() {
// 		return {
// 			userid: '',
// 			password: '',
// 			code: ''
// 		}
// 	},
// 	methods: {
// 		// 关闭登录
// 		handleClose() {
// 			let _self = this;
// 			_self.SetLogin(false)
// 		},
// 		//去注册页面
// 		toRegister() {
// 			let _self = this
// 			_self.handleClose();
// 			uni.navigateTo({
// 				url: "/pages/userCenter/auditregister/register/index"
// 			})
// 		},
// 		// 登录提交
// 		handleLogin() {
// 			let _self = this;
// 			let pwd = _self.password.MD5().toUpperCase()
// 			let params = {
// 				userid: _self.userid,
// 				password: pwd
// 				// router: _self.currRoute
// 			};
// 			_self.$http.fetchData({
// 				url: '/WebAPI/login/login',
// 				data: params,
// 				success: function(res) {
// 					if (res.ResultCode === 0) {
// 						uni.setStorageSync('token', res.Data.FToken)

// 						_self.SetLogin(false)
// 						setTimeout(() => {
// 							_self.getUserInfo()
// 						}, 50)
// 					}
// 				}
// 			})
// 		},
// 		// 获取用户信息
// 		getUserInfo() {
// 			let _self = this;
// 			_self.$http.fetchData({
// 				url: '/WebAPI/user/userInfo',
// 				success: function(res) {
// 					if (res.ResultCode === 0) {
// 						_self.login(res.Data)
// 					}
// 				}
// 			})
// 		},
// 		...mapMutations(['SetLogin', 'login'])
// 	},
// 	computed: {
// 		...mapGetters(['isLogin','isCart','isOrder','isPayment'])
// 	}
// }
