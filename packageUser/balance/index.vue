<template>
	<view class="wrap">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="余额"></commonNavbar>
		</view>
		<view class="blance-wrap">
			<image class="back" src="../../static/blance-back.png"></image>
			<view class="blance-info">
				<text>我的余额</text>
				<view class="num">
					<text class="sz">{{balance}}</text>
					<text>元</text>
				</view>
			</view>
			<view class="blance-more" @click="goDetails">
				<image class="icon" src="../../static/blance-detail.png"></image>
				<text>明细</text>
			</view>
		</view>
		<view class="blance-title">-余额充值-</view>
		<view class="blance-list">
			<view class="blance-item" :class="selBlance==item?'active':''" v-for="(item,i) in blanceData" :key="i"
				@click="handleItem(item)">{{item}}元</view>
		</view>
		<input type="number" class="blance-custom" placeholder="自定义金额" maxlength="8" v-model="customBlance" confirm-type="done" @blur="checkBlance" @confirm="checkBlance" />
		<view class="btn" @click="pay">立即充值</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				shopid: '',
				selBlance: 10000,
				blanceData: [10000, 50000, 100000],
				balance: 0,
				customBlance: null
			}
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		onShow() {
			let shopid = uni.getStorageSync('shopid')
			this.shopid = shopid
			this.getBalance()
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
			handleItem(item){
				this.selBlance = item
				this.customBlance = null
			},
			checkBlance(){
				if(this.customBlance && this.customBlance > 0 && this.customBlance < 756){
					uni.showToast({
					  title: '最低充值金额756',
						icon:'none'
					});			
					return
				}
				this.selBlance = this.customBlance
			},
			getBalance(){
				let that = this
				that.$http.fetchData({
					url:'/front/user/bake/vip_serverMgr/getBalance',
					method: 'GET',
					success: res => {
						if(res.ResultCode == 0){
							that.balance = res.Data
						}
					}
				})
			},
			goDetails() {
				uni.navigateTo({
					url: 'details'
				})
			},
			pay() {
				let that = this
				// 发起订阅
				wx.requestSubscribeMessage({
					tmplIds: ['Gvw63lGwjcEVnyLjkE6j1cTIZ52SAmlYRHFtC0-7i7s'],
					complete: () => {
						that.$http.fetchData({
							header: {
								"Content-Type": "application/json;charset=utf-8;"
							},
							url: '/front/user/bake/goodsMgr/vipOrder',
							data: {
								totalPrice: that.selBlance,
								shopId: that.shopid,
							},
							success: res => {
								if (res.ResultCode === 0) {
									that.toPay(JSON.parse(res.ResultInfo))
								} else {
									uni.showToast({
										title: res.ResultInfo,
									})
								}
							}
						})						
					}
				})
			},
			toPay(data){
				let that = this
				let info = JSON.parse(data.result.payInfo)
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: info.timeStamp,
					nonceStr: info.nonceStr,
					package: info.package,
					signType: info.signType,
					paySign: info.paySign,
					success: function(res) {
						if (res.errMsg == "requestPayment:ok") {
							uni.showToast({
								title: '支付成功',
								icon:'success',
								mask: true
							});
							that.getBalance()
						}
					},
					fail: function(err) {
						uni.showToast({
						  title: '支付失败',
							icon:'none'
						});						
					}
				});
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		position: fixed;
		left: 25rpx;
		right: 25rpx;
		bottom: 30rpx;
		margin-bottom: env(safe-area-inset-bottom);
		height: 78rpx;
		background-color: #333333;
		border-radius: 4rpx;
		display: block;
		text-align: center;
		font-size: 30rpx;
		font-weight: 700;
		line-height: 78rpx;
		color: #fff;
	}

	.wrap {
		background-color: #fff;
		padding: 0 25rpx;
		
		.blance-custom{
			width: 100%;
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			color: #666;
			background-color: #eee;
			border-radius: 4rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
		}

		.blance-list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.blance-item {
				width: 220rpx;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				color: #666;
				background-color: #eee;
				margin: 28rpx 20rpx 0 0;
				border-radius: 4rpx;
			}

			.blance-item.active {
				background: rgba(51, 51, 51, 0.05);
				border: 4rpx solid #333333;
				color: #000;
			}

			.blance-item:nth-child(3n) {
				margin-right: 0;
			}
		}

		.blance-title {
			width: 100%;
			display: block;
			text-align: center;
			padding: 70rpx 0 30rpx 0;
			font-size: 30rpx;
			color: #686868;
		}

		.blance-wrap {
			width: 100%;
			height: 260rpx;
			display: block;
			position: relative;

			.back {
				width: 100%;
				height: 100%;
				display: block;
			}

			.blance-more {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 22rpx;
				color: rgba(255, 255, 255, 0.7);

				.icon {
					width: 32rpx;
					height: 32rpx;
					display: block;
					margin-bottom: 12rpx;
				}
			}

			.blance-info {
				position: absolute;
				top: 70rpx;
				bottom: 80rpx;
				left: 0;
				right: 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: #fff;

				.num {
					text-align: center;
					font-size: 26rpx;
					font-weight: 700;
					line-height: 86rpx;

					.sz {
						font-size: 52rpx;
						margin-right: 14rpx;
					}
				}
			}
		}
	}

	.page-top {
		background-color: #fff;
		width: 100%;
		display: block;
	}
</style>