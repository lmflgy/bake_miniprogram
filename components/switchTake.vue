<template>
	<view class="page-container u-flex u-row-between u-col-center">
		<view class="location-item" v-if="tabIndex==1">
			<view class="location u-flex u-col-center" @click="toAddr" v-if="addr.detail">
				<text class="other" v-if="addr.detail && addr.houseNumber">{{addr.province}}{{addr.city}}{{addr.district}}{{addr.detail}}{{addr.houseNumber}}</text>
				<text class="other" v-else>{{addr.province}}{{addr.city}}{{addr.district}}{{addr.detail}}</text>
				<image class="arrow" src="@/static/arrow-right-mini.png"></image>
			</view>
			<text class="sub-tip" v-if="addr.name">{{addr.name+' '}}{{addr.gender}}士&nbsp;&nbsp;{{addr.phone}}</text>
			<text class="sub-tip" v-else @click="toAddr">请先添加地址</text>
		</view>
		<view class="location-item" v-else>
			<view class="location other">{{shopInfo.name}} </view>
			<text class="sub-tip" v-if="isAuth">距离您 {{distance}}km</text>
		</view>
		<view class="switch-item u-flex">
			<template v-if="order">
				<view v-for="(item,index) in ways" :key="index" class="u-flex-1 si" @click="handleSwitch(index)" :class="index==tabIndex?'current':'tab'">{{item}}</view>
			</template>
			<template v-else>
				<view v-for="(item,index) in ways" :key="index">
					<view class="u-flex-1 si" @click="handleSwitch(index)" :class="index==tabIndex?'current':'tab'" v-if="index<2">{{item}}</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: "switchTake",
		props: {
			tabIndex: {
				type: [String, Number],
				default: 0
			},
			order: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				takeway: 0,
				ways: ['自提', '外卖', '快递'],
				shopInfo: {},
				addr: {},
				isAuth: false,
				location: {
					lat: 0,
					lng: 0,
				},
				distance: 0
			};
		},
		mounted() {
			this.init(this.tabIndex)
		},
		methods: {
			toAddr() {
				uni.navigateTo({
					url: '/packagePages/address/index'
				})
			},
			init(index) {
				if (index == 1) {
					let addr = wx.getStorageSync('defaultAddr')
					if (addr) {
						this.addr = addr
						this.$emit('init', true)
					} else {
						this.toAddr()
					}
				} else {
					this.shopInfo = wx.getStorageSync('shopInfo')
					this.location = this.shopInfo.location
					console.log('店铺坐标', this.location)
					this.getnow()
				}
			},
			handleSwitch(index) {
				// this.tabIndex = index
				this.$emit('handleSwitch', index)
				this.init(index)
			},
			getnow() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					accuracy: 'best',
					success: (res) => {
						this.isAuth = true
						this.handleDistance(res.latitude, res.longitude)
					},
					fail: (err) => {
						this.isAuth = false
						uni.showToast({
							title: '已拒绝获取位置信息',
							duration: 2000,
							icon: 'none'
						});
					}
				});
			},
			//根据金纬度计算距离
			handleDistance(lat1, lng1) {
				let that = this;
				let lat2 = that.location.lat;
				let lng2 = that.location.lng;
				let rad1 = lat1 * Math.PI / 180.0; // 角度转弧度
				let rad2 = lat2 * Math.PI / 180.0;
				let a = rad1 - rad2;
				let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(
					Math.sin(b / 2), 2)));
				s = s * 6378.137; // 弧长等于弧度乘地球半径6378137.0米 
				s = Math.round(s * 10000) / 10000;
				s = s.toString();
				s = s.substring(0, s.indexOf('.') + 2);
				// return s
				that.distance = s
				console.log(that.distance)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.page-container {
		// position: fixed;
		width: 100%;
		padding-top: 28rpx;
		background-color: #fff;
		padding: 15rpx 26rpx 0;
		z-index: 10;
		overflow: hidden;

		.location {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
			padding-bottom: 15rpx;
			display: flex;
			align-items: center;
			overflow: hidden;
			&-item{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-bottom: 20rpx;
				overflow: hidden;
			}
		}

		.arrow {
			width: 14rpx;
			height: 24rpx;
			display: block;
			margin-left: 10rpx;
		}

		.other {
			max-width: 465rpx;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		.sub-tip {
			font-size: 26rpx;
			font-family: PingFang SC;
			color: #999999;
		}

		.switch-item {
			height: 50rpx;
			border: 2rpx solid #333333;
			border-radius: 25rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			line-height: 50rpx;
			text-align: center;
			.si{
				width: 94rpx;
			}
		}

		.tab {
			color: #666666;
		}

		.current {
			width: 94rpx;
			height: 50rpx;
			color: #fff;
			background-color: #333333;
			border-radius: 25rpx;
		}
	}
</style>