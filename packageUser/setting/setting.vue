<template>
	<view class="setting-page" :style="{'padding-top':statusBarHeight+'px'}">
		<commonNavbar leftText="设置" custome @backTo="backTo"></commonNavbar>
		<view class="top">
			<u-cell-group :border="false">
				<button class="headwrap" open-type="chooseAvatar" hover-class="none" @chooseavatar="getHeadimg">
					<u-cell :isLink="true" arrow-direction="right">
						<view class="cell-name" slot="title">头像</view>
						<view class="cell-value" slot="value">
							<image :src="userData.photoUpload" mode="" class="avatar"></image>
						</view>
					</u-cell>
				</button>
				<u-cell :isLink="true" arrow-direction="right" @click="changeAva" v-if="false">
					<view class="cell-name" slot="title">头像</view>
					<view class="cell-value" slot="value">
						<image :src="userData.photoUpload" mode="" class="avatar"></image>
					</view>
				</u-cell>
				<u-cell v-if="false">
					<view class="cell-name" slot="title">绑定手机号</view>
					<view class="cell-value" slot="value">
						<input type="tel" v-model="userData.mobile" class="nameInput" placeholder="请输入手机号">
					</view>
				</u-cell>
				<button class="headwrap" hover-class="none" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					<u-cell :isLink="true" arrow-direction="right">
						<view class="cell-name" slot="title">绑定手机号</view>
						<view class="cell-value" slot="value">
							<text v-if="userData.mobile">{{userData.mobile}}</text>
							<text v-else>请绑定手机号</text>
						</view>
					</u-cell>
				</button>
				<u-cell :isLink="true" arrow-direction="right">
					<view class="cell-name" slot="title">昵称</view>
					<view class="cell-value" slot="value">
						<input type="nickname" v-model="userData.nickname" class="nameInput" @blur="changeName">
					</view>
				</u-cell>
			</u-cell-group>
		</view>
		<view class="btn">
			<u-cell-group>
				<u-cell @click="loginOut" v-if="isback == 0">
					<view class="cell-name" slot="title">退出登录</view>
				</u-cell>
				<u-cell @click="backTo" v-else>
					<view class="cell-name" slot="title">返回</view>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				// screenHeight: 0,
				// statusBarHeight: 0,
				// avatar: '',
				// nickName: '捣碎草莓冰～',
				userData: {},
				userid: '',
				isback: 0,
				isscan: 0,
				isname: 0,
				wxCode: ''
			};
		},
		onLoad(param) {
			if(param.isback){
				this.isback = param.isback
				this.isscan = param.isscan
			}
		},
		computed: {
			...mapGetters(['userInfo', 'screenHeight', 'statusBarHeight'])
		},
		mounted() {
			this.userid = wx.getStorageSync('userid')
			this.getInfo(this.userid)
		},
		onShareAppMessage() {
			const promise = new Promise(resolve => {
				let userid = wx.getStorageSync('userid')
				if (userid) {
					let that = this
					that.$http.fetchData({
						url: '/front/userMgr/getInfo',
						method: 'GET',
						data: { userid: userid },
						success: res => {
							if (res.ResultCode == 0) {
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
			...mapMutations(['SetLogin']),
			changeInfo(){
				let that = this
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
			getSessonKey(){
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
								that.sessionKey=logResult.Data.sessionKey
							}
						}
					})
				})
			},
			async getPhoneNumber (e) {
				console.log(e);
				if (e.detail.errMsg !== "getPhoneNumber:ok"){
					uni.showToast({
						title: '获取手机号授权失败',
						icon: 'none'
					});
					return; // 如果用户不同意授权则返回并结束
				}
				this.decode(e.detail)
			},
			decode(item, code){
				let that = this
				that.$http.fetchData({
					url: '/front/userMgr/decodeUserInfoV2',
					header: {
						'Content-Type': 'application/json;charset=UTF-8'
					},
					method: 'POST',
					data: {
						code: that.wxCode,
						encryptedData: item.encryptedData,
						iv: item.iv,
						userid: this.userid
					},
					success(res) {
						if (res.ResultCode == 0) {
							that.getInfo(that.userid)
							uni.showToast({ title: '绑定成功' });
							if(that.isback == 9){
								setTimeout(function(){
									uni.navigateBack({ delta:1 })
								}, 1500)
							}	
						}
					}
				});
			},
			async getInfo(id){
				let wxCode = await this.getLogin();
				this.wxCode = wxCode
				let that = this
				that.$http.fetchData({
					url: '/front/userMgr/getInfo',
					method: 'GET',
					data: {
						userid: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.userData=res.Data
						}
					}
				})
			},
			backTo(){
				if(this.isscan == 1){
					uni.redirectTo({ url: '/pages/index/index' });
				}else{
					if(this.isback == 9){
						uni.navigateBack({ delta:1 })
					}else{
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
				}
			},
			// 修改昵称
			changeName(e) {
				let that = this
				that.userData.nickname = e.detail.value
				if (!that.userData.nickname) {
					uni.showToast({
						title: '请输入新的内容',
						icon: "none"
					})
					return false
				}
				if(that.isname == 0){
					uni.showLoading({
						mask: true,
						title: "正在加载中"
					})
				}
				that.$http.fetchData({
					url: '/front/userMgr/update',
					method: 'POST',
					data: {
						pid: that.userid,
						nickname: that.userData.nickname
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.hideLoading()
							if(that.isname == 0){
								that.isname ++
								uni.showToast({
									title: '修改成功',
									icon: "success"
								})
							}
						}
					}
				})
			},
			getHeadimg(e){
				let that = this
				that.$http.uploadData({
					url: "/common/uploadNew",
					method: "POST",
					filePath: e.detail.avatarUrl,
					success: res => {
						if (res.ResultCode === 0) {
							// that.userData.photoUpload=res.url
							that.userData.photoUpload=that.$http.ossUrl+res.fileName
							that.$http.fetchData({
								url: '/front/userMgr/update',
								method: 'POST',
								data: {
									pid: that.userid,
									photoUpload: that.userData.photoUpload
								},
								success: res => {
									if (res.ResultCode === 0) {
										uni.showToast({
											title: '修改成功',
											icon: "success"
										})
									}
								}
							})
						}
					}
				})
			},
			// 头像
			changeAva(){
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], 
					sourceType: ['album'], //从相册选择
					success: function (res) {
						that.$http.uploadData({
							url: "/common/uploadNew",
							method: "POST",
							filePath: res.tempFilePaths[0],
							success: res => {
								if (res.ResultCode === 0) {
									// that.userData.photoUpload=res.url
									that.userData.photoUpload=that.$http.ossUrl+res.fileName
									that.$http.fetchData({
										url: '/front/userMgr/update',
										method: 'POST',
										data: {
											pid: that.userid,
											photoUpload: that.userData.photoUpload
										},
										success: res => {
											if (res.ResultCode === 0) {
												uni.showToast({
													title: '修改成功',
													icon: "success"
												})
											}
										}
									})
								}
							}
						})
					}
				});
			},
			loginOut(){
				let that = this
				uni.showLoading({
					mask: true,
					title: '正在退出...',
					duration: 2000,
				});
				that.$http.fetchData({
					url: '/front/userMgr/signOut',
					method: 'GET',
					success: res => {
						if (res.ResultCode === 0) {
							that.SetLogin(false)
							wx.clearStorageSync()
							uni.navigateTo({
								url: '/packageUser/login/login',
								success() {
									uni.hideLoading()
								}
							})
						}
					}
				})
				// setTimeout(function() {
				// 	// uni.removeStorageSync('storage_key');
				// 	// uni.removeStorageSync('distributorId');
				//  //  uni.removeStorageSync("allCartNum")
				// 	uni.reLaunch({
				// 		url: '/packageUser/login/login',
				// 		success() {
				// 			uni.hideLoading()
				// 		}
				// 	})
				// }, 1000)
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	@import './setting.scss';
</style>