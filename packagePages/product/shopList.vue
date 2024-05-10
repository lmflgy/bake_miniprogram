<template>
	<view class="shop-list-con">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}"><commonNavbar leftText="商品列表"></commonNavbar></view>
		<view class="con">
			<view class="lists" v-for="(item,index) in list3" :key="index" @click="toDetail(item)">
				<image
					:src="item.images"
					mode="aspectFill" class="item-img"></image>
				<view class="bottom">
					<view>{{item.goodsName}}</view>
					<view class="introduce">{{item.content}}</view>
					<view class="money">¥{{item.price}}</view>
				</view>
			</view>
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
				pid:'',
				keyword:'',
				list3:[],
				takeType:''
			}
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		onLoad: function(option) {
			
			this.pid = option.pid
			this.keyword = option.keyword
			this.takeType = option.takeType
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
				url: '/front/user/bake/goodsMgr/getGoodsByclassifyId',
				method: 'GET',
				data: {
					classifyId: this.pid
				},
				success: res => {
					if (res.ResultCode === 0) {
						let data = res.Data.Items
						data.forEach(item=>{
							item.images=that.$http.ossUrl+item.images
						})
						
						that.list3=data
					
						uni.hideLoading();
					}
				}
			})
		},
		toDetail(item) {
						uni.navigateTo({
							url: '/packagePages/product/index?pid=' + item.pid + '&type=' + this.takeType
						})
					},
		}
	}
</script>

<style lang="scss" scoped>
	.shop-list-con {
		height: 100vh;
		background-color: #fff;
		padding: 0 25rpx;
		margin-top: 198rpx;
		.con {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			background: #fff;
			.lists {
				font-weight: bold;
				width: 48%;
				    overflow: hidden;
				margin-bottom: 50rpx;
				.item-img{width: 100%;height: 430rpx;}
				.bottom{
					font-size: 26rpx;
					.introduce{white-space: nowrap;
					 overflow: hidden;
					 text-overflow: ellipsis;}
					 .money{font-weight: bold;margin-top: 10rpx;font-size: 30rpx;}
				}
			}
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