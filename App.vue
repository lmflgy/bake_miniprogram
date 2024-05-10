<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			wx.removeStorageSync('shop')
			wx.showShareMenu({
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"],
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
			wx.removeStorageSync('isScan')
		},
		data() {
			return {
				token: ''
			}
		},
		created() {
			this.screenInfo()
		},
		// onShareTimeline: function(res) {
		// 	var that = this;
		// 	let userid = wx.getStorageSync('userid')
		// 	return {
		// 		title: `more to luv生日蛋糕`,
		// 		// imageUrl: `https://bbs.txwb.com/images/wmapp/share.jpg`,
		// 		query: "",
		// 		success: function(res) {},
		// 	};
		// },
		onShareAppMessage(res) {
			const promise = new Promise(resolve => {
				let userid = wx.getStorageSync('userid')
				if (userid) {
					let that = this
					that.$http.fetchData({
						url: '/front/userMgr/getInfo',
						method: 'GET',
						data: {
							userid: userid
						},
						success: res => {
							if (res.ResultCode == 0) {
								console.log(res.Data);
								resolve({
									title: 'more to luv生日蛋糕',
									path: "/packagePages/share/index?code=" + res.Data.invitationCode,
								})
							}
						}
					})
				}
			})
			return {
				title: `more to luv生日蛋糕`,
				path: "/packagePages/share/index",
				promise
			};
		},
		methods: {
			...mapMutations(['screenInfo', 'SetLogin']),
			checkStatus() {
				let that = this
				uni.checkSession({
					success(res) {
						console.log("登录未过期，进行下一步操作")
						let token = wx.getStorageSync('token')
						if (token) {
							that.SetLogin(true)
							that.getDefaultStore()
						} else {
							that.SetLogin(false)
							uni.navigateTo({
								url: '/packageUser/login/login'
							})
						}
					},
					fail() {
						console.log("登录已过期，请重新登录")
						that.SetLogin(false)
						uni.navigateTo({
							url: '/packageUser/login/login'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'uview-ui/index.scss';
	// @import './common/styles/font.scss';
	@import './common/styles/common.scss';

	html {
		font-size: 16px;
	}

	body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
			'Droid Sans', 'Helvetica Neue', 'Microsoft Yahei', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: #FAFAF9;
	}



	view,
	image,
	text {
		box-sizing: border-box;
		flex-shrink: 0;
	}

	#app {
		width: 100vw;
		height: 100vh;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-col {
		display: flex;
		flex-direction: column;
	}

	.justify-start {
		display: flex;
		justify-content: flex-start;
	}

	.justify-center {
		display: flex;
		justify-content: center;
	}

	.justify-end {
		display: flex;
		justify-content: flex-end;
	}

	.justify-evenly {
		display: flex;
		justify-content: space-evenly;
	}

	.justify-around {
		display: flex;
		justify-content: space-around;
	}

	.justify-between {
		display: flex;
		justify-content: space-between;
	}

	.items-start {
		display: flex;
		align-items: flex-start;
	}

	.items-center {
		display: flex;
		align-items: center;
	}

	.items-end {
		display: flex;
		align-items: flex-end;
	}
</style>