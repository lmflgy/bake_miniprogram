<template>
	<view class="page">
	  <view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
	  	<!-- <navbar leftText="登录"></navbar> -->
			<commonNavbar leftText="登录"></commonNavbar>
	  </view>
	  <view class="group_4">
	    <view class="image-text_1">
	      <image :src="avatar" class="single-avatar_1"></image>
	      <text lines="1" class="text-group_1" v-if="nickName">您好，{{nickName}}～</text>
	    </view>
	    <text lines="1" class="text_2">为了您的账户安全，请绑定手机号</text>
			<!-- bindtap="onClick" -->
	    <button class="button_1" bindtap="onClick" @click="toLogin" v-if="isLogin">
	      <text lines="1" class="text_3">授权登录</text>
	    </button>
			<button class="button_1" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="false">
			<text lines="1" class="text_3">手机号授权</text>
			</button>
	  </view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				avatar: require('../../static/user/avatar.png'),
				nickName: '',
				userData: {},
				openid: '',
				sessionKey: '',
				userid: '',
				phone: '',
				isReg: false,
				isLogin: true
			};
		},
		computed: {
			...mapGetters(['userInfo', 'statusBarHeight'])
		},
		mounted() {

		},
		onShow() {
			let token = uni.getStorageSync('token')
			if(token){
				uni.navigateBack()
			}
		},
		beforeDestroy() {
			clearTimeout()
		},
		methods: {
			...mapMutations(['SetLogin', 'login']),
			getShopInfo(id){
				let that = this
				that.$http.fetchData({
					url: "/front/user/bake/shopMgr/getInfo",
					method: "GET",
					data: {
						pid: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							let info = {
								name: res.Data.name,
								phone: res.Data.concat,
								location: res.Data.location,
								addr: res.Data.province+res.Data.city+res.Data.district+res.Data.detail
							}
							wx.setStorageSync('shopInfo',info);
							console.log('login中获取shopinfo')
						}
					}
				})
			},
			getPhoneNumber (e) {
				if (e.detail.errMsg !== "getPhoneNumber:ok"){
					uni.showToast({
						title: '获取手机号授权失败',
						icon: 'none'
					});
					return; // 如果用户不同意授权则返回并结束
				}
				this.decode(e.detail)
			},
			getUserInfo() {
				return new Promise((resolve, reject) => {
					wx.getUserProfile({
						lang: 'zh_CN',
						desc: '用户登录', 
						success: (res) => {
							resolve(res.userInfo)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			getLogin() {
				return new Promise((resolve, reject) => {
					wx.login({
						success(res) {
							resolve(res.code)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			toLogin() {
				uni.showLoading({
					title: '登录中',
					mask: true
				})
				let that = this
				that.isLogin = false
				let sharecode = wx.getStorageSync('sharecode')
				let userInfo = this.getUserInfo();
				let wxCode = this.getLogin();
				Promise.all([userInfo, wxCode]).then((res) => {
					that.$http.fetchData({
						url: '/front/wxlogin/weLogin',
						method: 'GET',
						data: {
							code: res[1],
							sharecode: sharecode
						},
						success(logResult) {
							if (logResult.ResultCode == '0') {
								//都获取权限成功
								that.avatar = res[0].avatarUrl
								that.nickName = res[0].nickName
								if(logResult.Data.userid){
									that.isReg=false
									that.userid = logResult.Data.userid
									wx.setStorageSync('token',logResult.Data.token)
									wx.setStorageSync('userid',that.userid);
									that.SetLogin(true)
									uni.showToast({
										title: '登录成功',
										mask: true,
										duration: 3000
									})
									setTimeout(()=>{
										// 是否新注册
										if(logResult.Data.isReg){
											let isScan = wx.getStorageSync('isScan')
											if(isScan){
												uni.navigateTo({
													url: '/packageUser/setting/setting?isback=1&isscan=1'
												})
											}else{
												
												uni.navigateTo({
													url: '/packageUser/setting/setting?isback=1&isscan=0'
												})
											}
										}else{
											let isScan = wx.getStorageSync('isScan')
											if(isScan){
												uni.redirectTo({
													url: '/pages/index/index'
												});
											}else{
												that.$http.fetchData({
													url: "/front/user/bake/shopMgr/getDefaultStore",
													method: "GET",
													success: res => {
														if (res.ResultCode === 0) {
															setTimeout(function(){
																uni.navigateBack()
															},600)
														}
													}
												})
											}
										}
									}, 1500)
									
								}else{
									//that.isReg=true
									//that.openid = logResult.Data.openid
									//that.toregister()
								}
								that.sessionKey=logResult.Data.sessionKey
							}else{
								that.isLogin = true
							}
						}
					});
				}).catch(err => {
					that.isLogin = true
					uni.showToast({
					  title: '授权已取消',
					  icon: 'error',
					  mask: true,
					});
				})
			},
			decode(item){
				let that = this
				that.$http.fetchData({
					url: '/front/wxlogin/decodeUserInfo',
					header: {
						'content-type': "application/json"
					},
					data: {
						encryptedData: JSON.stringify(item.encryptedData),
						iv: JSON.stringify(item.iv),
						sessionKey: JSON.stringify(that.sessionKey),
					},
					success(res) {
						if (res.ResultCode == '0') {
							that.phone = res.Data
							that.toregister(item)
						}
					}
				});
			},
			toregister(){
				let that = this
				let sharecode = wx.getStorageSync('sharecode')
				that.$http.fetchData({
					url: '/front/wxlogin/weRegister',
					header: {
						'content-type': "application/json"
					},
					data: {
						avatar: that.avatar,
						//code: item.code,
						code: '',
						nickName: that.nickName,
						openid: that.openid,
						phone: '',
						sharecode: sharecode
					},
					success(res) {
						if (res.ResultCode == '0') {
							wx.setStorageSync('token',res.Data.token)
							wx.setStorageSync('userid',res.Data.userid);							
							that.SetLogin(true)
							// 注册成功
							let isScan = wx.getStorageSync('isScan')
							if(isScan){
								uni.navigateTo({
									url: '/packageUser/setting/setting?isback=1&isscan=1'
								})
							}else{
								
								uni.navigateTo({
									url: '/packageUser/setting/setting?isback=1&isscan=0'
								})
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './login.scss';
</style>