<template>
	<view class="wrap">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="门店列表"></commonNavbar>
		</view>
		<view :style="{'height':statusBarHeight+44+'px'}"></view>
		<view class="page-head">
			<view class="page-head-location">
				<image class="location-icon" src="../../static/shop-location.png"></image>
				<text class="shop-name" v-if="currentShop != null">{{currentShop.name}}</text>
			</view>
			<view class="page-head-search" :class="isSearch ? 'active' : ''">
				<image class="icon" src="../../static/shop-search.png"></image>
				<input class="input" :value="shopName" :placeholder="isSearch?'输入门店名称':'搜索'" maxlength="50" confirm-type="search" @focus="isSearch = true" @blur="isSearch = false" @input="handleInput" @confirm="confirmSearch" />
			</view>
		</view>
		<view class="shop" v-if="list != null && list.length > 0">
			<view class="shop-item" :class="item.pid == shopid ? 'active' : ''" v-for="(item,i) in list" :key="i" @click="chooseItem(item)">
				<image class="choose" src="../../static/shop-choose.png"></image>
				<view class="details">
					<text class="title">{{item.name}}</text>
					<text class="region">{{item.province}}{{item.city}}{{item.district}}{{item.detail}}</text>
					<text class="time">营业时间：{{item.businesshoursStart.substring(0,5)}} - {{item.businesshoursEnd.substring(0,5)}}</text>
					<view class="tags">
						<text class="tag sel">营业中</text>
						<text class="tag">可自提</text>
					</view>
				</view>
				<view class="right">
					<text class="go">去下单</text>
					<text class="jl">距离 {{(item.distance / 1000).toFixed(2)}}km</text>
					<image class="tel" src="../../static/shop-telphone.png" @click.stop="make(item.concat)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				isSearch: false,
				shopName: '',
				currentShop: null,
				shopid: '',
				lat:'',
				lng:'',
				list: []
			}
		},
		onLoad() {
			this.shopid = param.shopid
			this.lat = param.lat
			this.lng = param.lng
		},
		onShow() {
			this.shopid = uni.getStorageSync('shopid')
			this.lat = uni.getStorageSync('shop_lat')
			this.lng = uni.getStorageSync('shop_lng')
			uni.setStorageSync('oldshopid',this.shopid)
			this.loadInit()
		},
		computed:{
			...mapGetters(['statusBarHeight'])
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
			handleInput(e){
				this.shopName = e.detail.value
			},
			confirmSearch(){
				this.loadInit(false)
			},
			chooseItem(item){
				this.currentShop = item
				this.shopid = item.pid
				// 存入缓存				
				uni.setStorageSync('shop',JSON.stringify(item))
				uni.setStorageSync('shopid',item.pid);
				uni.navigateBack({delta:1})
				// 去下单
				//uni.switchTab({ url: '/pages/menu/index' })
			},
			make(tel){
				uni.makePhoneCall({
					phoneNumber: tel
				})
			},
			loadInit(isUpdate = true){
				this.$http.fetchData({
					url:'/front/user/bake/shopMgr/getLatelyShop',
					method: 'GET',
					data: {
						lat: this.lat,
						lng: this.lng,
						name: this.shopName
					},
					success: res => {
						if(res.ResultCode == 0){
							this.list = res.Data
							if(this.list != null && this.list.length > 0){
								this.list.forEach((item) => {
									if(item.pid == this.shopid){
										this.currentShop = item
									}
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop{
		width: 100%;
		display: block;
		padding: 12rpx 25rpx;
		&-item{
			width: 100%;
			display: flex;
			background-color: #fff;
			border-radius: 12rpx;
			padding: 24rpx 0;
			border: solid 1px #fff;
			position: relative;
			margin-top: 24rpx;
			transition: all .3s;
			.choose{
				width: 30rpx;
				height: 30rpx;
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				opacity: 0;
				visibility: hidden;
				transition: all .3s;
			}
			.details{
				flex: 1;
				padding: 0 24rpx;
				display: flex;
				flex-direction: column;
				border-right: solid 1px #F4F1F4;
				.title{
					width: 100%;
					display: block;
					font-size: 28rpx;
					font-weight: 700;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.region{
					width: 100%;
					display: block;
					font-size: 24rpx;
					color: #999;
					margin-top: 16rpx;
				}
				.time{
					width: 100%;
					display: block;
					font-size: 24rpx;
					color: #999;
					margin-top: 16rpx;
				}
			}
			.right{
				width: 170rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.go{
					font-size: 26rpx;
					color: #000;
				}
				.jl{
					margin-top: 20rpx;
					font-size: 20rpx;
					color: #999;
				}
				.tel{
					width: 68rpx;
					height: 68rpx;
					display: block;
					margin-top: 20rpx;
				}
			}
			.tags{
				width: 100%;
				display: flex;
				margin-top: 16rpx;
				.tag{
					display: block;
					height: 34rpx;
					line-height: 34rpx;
					font-size: 22rpx;
					background-color: #EDEDED;
					border-radius: 2rpx;
					margin-right: 14rpx;
					padding: 0 16rpx;
				}
				.tag.sel{
					background-color: #424242;
					color: #fff;
				}
			}
		}
		&-item.active{
			border-color: #333;
			position: relative;
			.choose{
				opacity: 1;
				visibility: visible;
			}
		}
	}
	.page-head{
		width: 100vw;
		height: 100rpx;
		display: flex;
		padding: 20rpx 25rpx;
		background-color: #fff;
		&-search{
			width: 165rpx;
			height: 60rpx;
			display: block;
			background-color: #EDEDED;
			border-radius: 30rpx;
			position: relative;
			padding: 0 40rpx 0 75rpx;
			transition: all .3s;
			.icon{
				width: 30rpx;
				height: 30rpx;
				display: block;
				position: absolute;
				top: 16rpx;
				left: 22rpx;
			}
			.input{
				width: 100%;
				height: 60rpx;
				display: block;
				line-height: 60rpx;
				font-size: 26rpx;
			}
		}
		&-search.active{
			width: 300rpx;
		}
		
		&-location{
			flex: 1;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			.location-icon{
				width: 26rpx;
				height: 32rpx;
				display: block;
			}
			.shop-name{
				flex: 1;
				padding: 0 30rpx 0 12rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.page-top{
		background-color: #fff;
		position: fixed;
		width: 100vw;
		z-index: 10;
	}
</style>