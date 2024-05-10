<template>
	<view class="shop-list-con">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}"><commonNavbar leftText="定制服务" bold="bold"></commonNavbar></view>
		<view class="con">
			
			<!-- <image 
				src="../../static/aaa.jpg"
				mode="scaleToFill" class="item-img"></image> -->
			<image v-if="info.linkImgUrl"
				:src="info.linkImgUrl"
				 class="item-img"  :style="{height:screenHeights+'px'}"></image>
		</view>
	</view>
</template>
<!--G1680128891437584384-->
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				info:{},
				screenHeights:0
			}
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		onLoad: function(option) {
			
		this.getShopList()
		},
		created() {
			let that = this
			// 获取手机的屏幕高度
			uni.getSystemInfo({
				success: (res) => {
					
					that.statusBarHeight = res.statusBarHeight
					that.screenHeight = res.windowHeight-res.statusBarHeight-88
					this.screenHeights = that.screenHeight+20
				}
			})
		},
		methods: {
		getShopList(){
			uni.showLoading({
				title: '加载中'
			});
			let that = this
			let shopid = wx.getStorageSync('shopid')
			that.$http.fetchData({
				url: '/bake/brand/getInfo',
				method: 'GET',
				data: {
					
				},
				success: res => {
					if (res.ResultCode === 0) {
						that.info = res.Data
					
						uni.hideLoading();
					}
				}
			})
		},
		}
	}
</script>

<style lang="scss" scoped>
	.shop-list-con {
		height: 90vh;
		background-color: #fff;
		padding: 0 25rpx;
		margin-top: 160rpx;
		color: #333;
		font-size: 28rpx;
		
		.title{
			font-size: 30rpx;
			font-weight: bold;
			margin-top: 30rpx;
		}
		.con{
			color: #000;justify-content: center;display: flex;flex-direction: column;align-items: center;width: 100%;
			video,image{width: 100%;margin-top: 30rpx;}
			.item-img{width: 100%;}
		}
	}
	.page-top {
		background-color: #fff;
		z-index: 10;
		position: fixed;
		top: 0;
		width: 100%;
	}
</style>