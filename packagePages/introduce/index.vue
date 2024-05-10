<template>
	<view class="shop-list-con">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}"><commonNavbar leftText="品牌介绍"></commonNavbar></view>
		<view class="con">
			  <!-- :poster="info.linkImgUrl" -->
			<video v-if="info.videoUrl"
			      :src="info.videoUrl"
			      controls
			    
			    ></video>
			<image v-if="info.imageUrl"
				:src="info.imageUrl"
				mode="widthFix" class="item-img"></image>
			<view class="title">{{info.content}}</view>
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
				info:{}
			}
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		onLoad: function(option) {
			
		this.getShopList()
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