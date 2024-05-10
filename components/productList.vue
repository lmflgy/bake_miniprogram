<template>
	<view class="product-page">
		<!-- <u-sticky bgColor="#fff" :offset-top="extra+'px'"> -->
			<!-- <u-tabs :list="cateList" :current="current" :activeStyle="{
					color: '#000',
					fontWeight: 'bold',
					fontSize: '30rpx',
					fontFamily: 'PingFang SC'
				}" :inactiveStyle="{
				  color: '#666',
				  fontSize: '30rpx',
				  fontFamily: 'PingFang SC'
				}" itemStyle="padding-left: 25rpx; padding-right: 11rpx; height: 88rpx;" lineColor="#000" lineWidth="52rpx"
				@click="handleTab"></u-tabs> -->
		<!-- </u-sticky> -->
		<view class="con">
			<view class="nav-left">
				<view class="text1" :class="[current==index?'active':'']" v-for="(item,index) in cateList" @click="handleTab(item,index)">
					<text class="txt">{{item.name}}</text>
				</view>
			</view>
			<div class="right-pro">
				<view class="swiper-image">
					<u-swiper
						:list="list3"
						keyName="images"
						indicator
						:indicator="true"
						:radius="0"
						circular
						:autoplay="list3.length>1?true:false"
					></u-swiper>
				</view>
				<view class="list-info u-flex u-flex-wrap">
					
					<block v-for="(item,index) in productList" :key="index">
						<view class="item" @click="toDetail(item)">
							<image :src="item.images" mode="aspectFill" class="item-img"></image>
							<!-- <image src="https://hpdg.oss-cn-hangzhou.aliyuncs.com/profile/upload/2023/08/23/453f21a1-1103-4cc5-ac63-e547687435c4.jpg" mode="aspectFill" class="item-img"></image> -->
							
							<view class="item-title">
								{{item.name}}
							</view>
							
						</view>
						
					</block>
				</view>
			</div>
			
		</view>
		
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		name: "productList",
		props: {
			extra: {
				type: [Number, String],
				default: 0
			},
			keyword: {
				type: [Number, String],
				default: ''
			},
			takeType: {
				type: [Number, String],
				default: 0
			},
			isload: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				cateList: [],
				cateId: '',
				productList: [],
				ossUrl: '',
				current: 0,
				date: '',
				status: 0,
				list: [],
				today: '',
				list3:[]
			};
		},
		computed: {
			...mapGetters(['statusBarHeight', 'isLogin'])
		},
		created() {
			let shopid = wx.getStorageSync('shopid')
			this.current = 0
			this.getCate(shopid)
			this.ossUrl = this.$http.ossUrl
			// this.getBanner()
		},
		watch: {
			keyword(newVal, oldVal) {
				if (newVal !== oldVal) {
					console.log('key收到')
					this.getList(this.cateId)
				}
			},
			isLogin(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.getList(this.cateId)
				}
			},
			isload(newVal, oldVal) {
				let date = new Date()
				let y = date.getFullYear()
				let m = date.getMonth() + 1
				if (m < 10) {
					m = '0' + m
				}
				let d = date.getDate()
				this.today = y + '-' + m + '-' + d
				//this.loadData()
				let oldshopid = uni.getStorageSync('oldshopid')
				let shopid = wx.getStorageSync('shopid')
				if (oldshopid != shopid) {
					uni.setStorageSync('oldshopid', shopid)
					this.cateList = []
					this.productList = []
					this.current = 0
					this.getCate(shopid)
					this.ossUrl = this.$http.ossUrl
				}
			}
		},
		methods: {
			handleTab(item) {
				if(!item) return
				this.cateList.forEach((it, i) => {
					
					if (it.pid == item.pid) {
						this.current = i
					}
				})
				this.list3 = item.images.split(',')
				
				this.cateId = item.pid
				this.getList(item.pid)
				uni.pageScrollTo({
					scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0 
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/packagePages/product/shopList?pid='+item.pid+'&keyword='+this.keyword+'&takeType='+this.takeType
					// url: '/packagePages/product/shopList?pid=' + item.pid + '&type=' + this.takeType
				})
				// uni.navigateTo({
				// 	url: '/packagePages/product/index?pid=' + item.pid + '&type=' + this.takeType
				// })
			},
			loadData() {
				let shopid = wx.getStorageSync('shopid')
				let that = this
				that.$http.fetchData({
					url: '/front/merchant/server/sellEndManageList',
					method: 'GET',
					data: {
						type: 3,
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							if (res.Data) {
								that.date = res.Data[0].holiday
								that.status = res.Data[0].status
								that.list = res.Data[0].goodsIdList
							}
						}
					}
				})
			},
			handleSale(item) {
				if (this.date == this.today && this.status == 1) {
					if (this.list != null && this.list.length > 0) {
						let it = this.list.find(d => d == item.pid)
						if (it) {
							return true
						} else {
							return false
						}
					} else {
						return false
					}
				} else {
					return true
				}
			},
			getList(id) {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/categoriesMgr/getCategoriesByParentId',
					method: 'GET',
					data: {
						id: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.productList = res.Data.Items
							// that.productList = res.Data.Items
						}
					}
				})
			},
			getCate(id) {
				let that = this
				this.cateList = []
				that.$http.fetchData({
					url: '/front/user/bake/categoriesMgr/getParentCategoriesByShopId',
					method: 'POST',
					data: {
						shopId: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							if (res.Data.Items) {
								that.cateList = res.Data.Items
								that.cateId = res.Data.Items[0].pid
								//images
								that.handleTab(res.Data.Items[0])
								that.getList(that.cateId)
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.product-page {
		background-color: #fff;
	}
	.con{
		display: flex;
		margin: 31rpx 25rpx 0;
		.nav-left{margin: 0 0rpx 0 10rpx;
		width: 208rpx;
			.text1{
				font-size: 28rpx;
				font-weight: bold;
				height: 80rpx;
				line-height:80rpx;
				
				
				&.active{
					.txt{
						border-bottom: 6rpx solid #333;
						font-size: 38rpx;
					}
					
				}
			}
		}
	}
	.right-pro{
		flex: 1;
		.swiper-image{margin-bottom: 10rpx;}
	}
	.list-info {
		justify-content: space-between;
		width: 100%;
		box-sizing: content-box;
		.item {
			width: 49.5%;
			overflow: hidden;
			
			margin-bottom: 0.4%;
			position: relative;
			box-sizing: content-box;
			margin-right: 0.5%;
			&:nth-child(2n) {
				margin-right: 0;
			}

			&-img {
				// width: 668rpx;
				// height: 610rpx;
				width: 100%;
				height: 340rpx;
			}

			&-title {
				font-size: 30rpx;
				font-family: PingFang SC;
				
				padding: 16rpx 0 30rpx;
				position: absolute;
				    top: 10rpx;
				    left: 20rpx;
				    color: #fff;
				    font-weight: bold;
			}

			&-sub {
				width: 100%;
				margin-bottom: 22rpx;
			}

			&-price {
				font-size: 20rpx;
				font-weight: bold;
				margin-right: 8rpx;
				font-family: PingFang SC;

				.price {
					font-size: 32rpx;
				}
			}

			&-num {
				font-size: 22rpx;
				font-family: PingFang SC;
				color: #999999;
			}
		}

		.item.no::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.item.no {
			.nosale {
				position: absolute;
				top: 140rpx;
				left: 0;
				right: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				color: rgba(255, 255, 255, 0.75);
			}
		}
	}
</style>