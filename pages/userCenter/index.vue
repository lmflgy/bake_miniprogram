<template>
	<view class="user-center">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="我的" toHome></commonNavbar>
		</view>
		<view class="user-head">
			<image class="background" src="../../static/my-back.png" mode="widthFix"></image>
		</view>
		<view class="user-wrap">
			<template v-if="userData!=null">
				<view @click="toSetting">
					<image class="headimg" :src="userData.photoUpload"></image>
					<view class="nickname">{{userData.nickname}} ></view>
				</view>
			</template>
			<template v-else>
				<image class="headimg" src="../../static/user.png"></image>
				<view class="nickname">more to luv 用户</view>
				<view class="tips">为了更好的服务体验请授权登录</view>
				<view class="login" @click="goLogin">立即登录</view>
			</template>
			<view class="user-nav">
				<view class="nav-item" @click="goUrl('/packageUser/balance/index')">
					<text>余额/充值</text>
					<text class="num">{{balance}}</text>
				</view>
				<view class="nav-item jf">
					<text>积分</text>
					<text class="num">{{point}}</text>
				</view>
				<view class="nav-item">
					<text>优惠券</text>
					<text class="num">0</text>
				</view>
			</view>
			<view class="user-item" @click="goUrl('/packageUser/order/orderPage')">
				<text>我的订单</text>
				<image class="arrow" src="../../static/arrow-right.png"></image>
			</view>
			<view class="user-item" @click="goUrl('/packageUser/birthday/index')">
				<text>生日提醒</text>
				<image class="arrow" src="../../static/arrow-right.png"></image>
			</view>
			<view class="user-item" @click="goUrl('/packagePages/address/index')">
				<text>地址管理</text>
				<image class="arrow" src="../../static/arrow-right.png"></image>
			</view>
			<view class="user-item" @click="bindInivt">
				<view class="user-item-lt">
					<text>绑定邀请</text>
					<text class="tips"
						v-if="userData!=null&&userData.invitationCode">(已绑定：{{userData.invitationCode}})</text>
				</view>
				<image class="arrow" src="../../static/arrow-right.png"></image>
			</view>
			<view class="user-item" @click="goUrl('/packageUser/contact/index')">
				<text>联系我们</text>
				<image class="arrow" src="../../static/arrow-right.png"></image>
			</view>
		</view>
		<!--old-->
		<template v-if="false">
			<view class="top-box" :style="{'padding-top':statusBarHeight+'px'}">
				<uni-nav-bar left-icon="left" background-color="transparent" color="white" :border="false" fixed
					@clickLeft="back">
					<view class="nav-title">我的</view>
				</uni-nav-bar>
				<view class="user-top u-flex u-row-between">
					<view class="user-top-left u-flex">
						<image :src="userData.photoUpload" mode="aspectFill" class="img1"></image>
						<view class="info" v-if="userData">
							<view class="info-name">{{userData.nickname}}</view>
							<view class="info-phone" v-if="userData.mobile">{{userData.mobile | formatPhone}}</view>
						</view>
					</view>
					<view class="user-top-right" @click="toSetting">
						<image src="../../static/user/settting.png" mode="" class="img2"></image>
					</view>
				</view>
			</view>
			<view class="user-box">
				<view class="user-main">
					<view class="user-normal">
						<u-cell-group>
							<u-cell :isLink="true" arrow-direction="right" size="large"
								url="/packageUser/order/orderPage">
								<u-icon slot="icon" size="26" name="order"></u-icon>
								<view class="vip-cell" slot="title">我的订单</view>
							</u-cell>
							<u-cell :isLink="true" arrow-direction="right" size="large"
								url="/packagePages/address/index">
								<u-icon slot="icon" size="26" name="map"></u-icon>
								<view class="vip-cell" slot="title">地址管理</view>
							</u-cell>
							<u-cell :isLink="true" arrow-direction="right" size="large"
								url="/packageUser/contact/index">
								<u-icon slot="icon" size="26" name="kefu-ermai"></u-icon>
								<view class="vip-cell" slot="title">联系我们</view>
							</u-cell>
						</u-cell-group>
					</view>

					<view class="user-vip">
						<view class="subtitle u-flex u-row-center">
							<!-- <image src="../../static/user/service.png" class="subtitle-icon"></image> -->
							<text>- 我的服务 -</text>
						</view>
						<u-cell-group>
							<u-cell>
								<view class="vip-cell" slot="title">加入店铺vip可享受以下服务</view>
								<!-- <view class="vip-cell" slot="title">加入店铺vip可享受亲朋好友生日提前提醒服务及其他服务</view> -->
							</u-cell>
							<u-cell v-for="(item,index) in vipList" :key="index">
								<view class="vip-cell" slot="title">{{item.serverName}}</view>
								<view class="vip-tip" slot="value">剩余{{item.num}}次</view>
								<view class="vip-icon u-flex .u-row-center u-col-center" slot="icon">
									<image :src="ossUrl+item.icon" mode="aspectFill" class="img-vip"></image>
								</view>
							</u-cell>
						</u-cell-group>
					</view>
				</view>
			</view>
		</template>
		<invitCode :isShow="isCode" @cancle="isCode=false" @submit="isCode=false"></invitCode>
	</view>
</template>

<script>
	import invitCode from '@/components/invitCode.vue'
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			invitCode
		},
		data() {
			return {
				phone: '',
				userid: '',
				userData: null,
				isVIP: false,
				vipList: [],
				ossUrl: '',
				isCode: false,
				balance: 0,
				point: 0
			};
		},
		computed: {
			...mapGetters(['userInfo', 'screenHeight', 'statusBarHeight'])
		},
		filters: {
			formatPhone(val) {
				return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
			}
		},
		created() {
			this.ossUrl = this.$http.ossUrl
		},
		onShow() {
			let that = this
			let userid = wx.getStorageSync('userid')
			let shopid = wx.getStorageSync('shopid')
			if (userid) {
				that.userid = userid
				that.getInfo(userid, shopid)
				that.getBalance()
				this.getPoint()
			}
		},
		onShareAppMessage() {
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
			//...mapMutations(['SetLogin']),
			bindInivt() {
				if (this.userData != null && uni.$u.test.isEmpty(this.userData.invitationCode)) {
					this.isCode = true
				} else {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
				}
			},
			goUrl(url) {
				uni.navigateTo({
					url: url
				})
			},
			goLogin() {
				uni.navigateTo({
					url: '/packageUser/login/login'
				})
			},
			getBalance() {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/vip_serverMgr/getBalance',
					method: 'GET',
					success: res => {
						if (res.ResultCode == 0) {
							that.balance = res.Data
						}
					}
				})
			},
			getPoint() {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/vip_serverMgr/getPoint',
					method: 'GET',
					success: res => {
						if (res.ResultCode == 0) {
							that.point = res.Data
						}
					}
				})
			},
			checkVIP(userid, shopid) {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/vip_serverMgr/getVipIdByuserIdAndshopId',
					method: 'GET',
					data: {
						shopId: shopid,
						userId: userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							if (res.ResultInfo) {
								that.isVIP = true
								that.getVIP(res.ResultInfo)
							} else {
								that.isVIP = false
								that.getService(shopid)
								// uni.hideLoading();
							}
						}
					}
				})
			},
			getVIP(id) {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/vip_serverMgr/getVipServerByvipId',
					method: 'GET',
					data: {
						vipId: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							if (res.ResultInfo) {
								that.vipList = res.Data
								uni.hideLoading();
							}
						}
					}
				})
			},
			getService(id) {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/vip_serverMgr/serviceList',
					method: 'GET',
					data: {
						shopId: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							if (res.ResultInfo) {
								that.vipList = res.Data
								uni.hideLoading();
							}
						}
					}
				})
			},
			getInfo(userid, shopid) {
				uni.showLoading({
					title: '加载中'
				});
				let that = this
				that.$http.fetchData({
					url: '/front/userMgr/getInfo',
					method: 'GET',
					data: {
						userid: userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.userData = res.Data
							that.checkVIP(userid, shopid)
						}
					}
				})
			},
			back() {
				uni.navigateBack()
			},
			toSetting() {
				uni.navigateTo({
					url: '/packageUser/setting/setting'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>