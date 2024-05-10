<template>
	<view class="order-page">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="我的订单"></commonNavbar>
			<view class="switch-head u-flex">
				 <u-tabs :list="tabList" @click="handleTab" 
					keyName="key"
					:scrollable="false"
					lineWidth="60rpx"
					lineHeight="4rpx"
					lineColor="#000"
					:activeStyle="{
						color: '#000',
						fontWeight: 'bold',
						fontSize: '30rpx'
					}"
					:inactiveStyle="{
						color: '#666',
						fontSize: '30rpx'
					}"
					itemStyle="padding-left: 15rpx; padding-right: 15rpx; height: 100rpx; width: 375rpx">
				</u-tabs>
			</view>
		</view>
		<view :style="{'height':statusBarHeight+112+'px'}"></view>
		<view class="list-box" v-if="list.length">
			<view class="list-item" @click="toDetail(item)" v-for="(item,index) in list" :key="index">
				<view class="item-head u-flex u-row-between">
					<view class="left u-flex">
						<view class="tag" v-if="item.orderType==3">快递</view>
						<view class="tag" v-else-if="item.orderType==4">堂食</view>
						<view class="tag" v-else>{{item.orderType==1?'自提':'配送'}}</view>
						<text class="addr">{{item.shopName}}</text>
					</view>
					<text class="status" v-if="item.orderStatus==0">待付款</text>
					<text class="status" v-if="item.orderStatus==1">
						{{item.orderType==1?'制作完成待自提':'制作完成待发货'}}
					</text>
					<text class="status" v-if="item.orderStatus==2">已发货</text>
					<text class="status done" v-if="item.orderStatus==3">已完成</text>
					<text class="status done" v-if="item.orderStatus==4">已取消</text>
					<text class="status" v-if="item.orderStatus==5">待退款</text>
					<text class="status done" v-if="item.orderStatus==6">已退款</text>
					<text class="status" v-if="item.orderStatus==7">待接单</text>
					<text class="status" v-if="item.orderStatus==8">制作中</text>
					<text class="status" v-if="item.orderStatus==9">退款中</text>
					<text class="status" v-if="item.orderStatus==11">配送中</text>
				</view>
				<orderList :list="item.orderDetails">
					<template>
						<view class="total-item u-flex u-row-between" v-if="item.shansongPrice">
							<text class="time"></text>
							<text class="total">
								<text class="tip">配送费:</text>
								<text class="price">¥{{item.shansongPrice}}</text>
							</text>
						</view>
						<view class="total-item u-flex u-row-between">
							<text class="time">{{item.orderTime}}</text>
							<text class="total">
								<text class="tip">共{{item.orderDetails.length}}件商品&nbsp;&nbsp;合计:</text>
								<text class="price" v-if="item.shansongPrice">¥{{item.totalPrice+item.shansongPrice}}</text>
								<text class="price" v-else>¥{{item.totalPrice}}</text>
							</text>
						</view>
						<view class="btns u-flex u-row-right">
							<view class="btn ordinary" v-if="tabIndex" @click.stop="addToCart(item)">再来一单</view>
							<!--<view class="btn ordinary" v-if="item.orderType==2&&(item.orderStatus==1||item.orderStatus==7)" @click.stop="changeAddr(item)">修改地址</view>-->
							<button class="btn ordinary" open-type="contact" @tap.stop="handleRt" v-if="item.orderStatus>0">联系客服</button>
							<view class="btn ordinary" v-if="!tabIndex&&item.orderStatus<1" @click.stop="cancelOrder(item)">取消订单</view>
							<view class="btn btn-bg" v-if="!tabIndex&&item.orderStatus==0" @click.stop="toPay(item)">去支付</view>
							<view class="btn btn-bg" v-if="!tabIndex&&item.orderStatus==7||item.orderStatus==8" @click.stop="toRefund(item)">申请退款</view>
						</view>
					</template>
				</orderList>
			</view>
		</view>
		<view class="empty-box" v-else>
			<u-empty mode="order" iconSize="110" text="暂无订单"></u-empty>
		</view>
	</view>
</template>

<script>
	import orderList from '@/components/orderList.vue'
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		components: {orderList},
		data() {
			return {
				tabList:[],
				tabIndex: 0,
				list: [],
				// isCancel: false,
				// cancelId: ''
			};
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onShow() {
			this.getOrder()
			this.getChangeAddre()
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
		methods:{
			handleRt(){
				return false
			},
			// 获取修改地址
			getChangeAddre(){
				let orderId = wx.getStorageSync('addrlistchange')
				if(orderId){
					let addr = wx.getStorageSync('defaultAddr')
					let that = this
					that.$http.fetchData({
						url:'/front/user/bake/orderMgr/getEditAddressStatus',
						method:'GET',
						header: {
							'content-type': "application/json"
						},
						data: {
							orderId: orderId,
							lat: addr.lat,
							lng: addr.lng
						},
						success: res => {
							if(res.ResultCode == 0){
								if(res.Data){
									that.changeUpdateAddr(orderId)
								}else{
									wx.removeStorageSync('addrlistchange')
									// 距离太远不能切换
									uni.showModal({
										content:'当前地址和旧地址差距太大，不支持更换哦',
										showCancel:false
									})
								}
							}
						}
					})
				}
			},
			// 确定修改
			changeUpdateAddr(orderId){
				let item = wx.getStorageSync('defaultAddr')
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/editShippingAddress',
					method: 'POST',
					header: {
						'content-type': "application/json"
					},
					data: {
						adress: item.province+item.city+item.district+item.detail,
						name: item.name,
						phone: item.phone,
						sex: item.gender,
						lat: item.lat,
						lng: item.lng,
						orderId: orderId
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
							  title: '修改成功！',
							  duration: 2000,
								icon:'success'
							});
							wx.removeStorageSync('addrlistchange')
						}
					}
				})
			},
			// 修改地址
			changeAddr(item){
				wx.setStorageSync('addrlistchange',item.pid)
				uni.navigateTo({
					url:'/packagePages/address/index'
				})
			},
			// 再来一单
			addToCart(item){
				let that = this
				let shopid = wx.getStorageSync('shopid')
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/oneMoreOrder',
					method: 'POST',
					data: {
						orderId: item.pid,
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.switchTab({
								url:'/pages/cart/index'
							})
						}
					}
				})
			},
			// 支付
			toPay(item){
				let that = this
				let shopid = wx.getStorageSync('shopid')
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/toPay',
					method: 'POST',
					data: {
						orderId: item.pid,
						shopId:shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							let data = JSON.parse(res.ResultInfo)
							if(data.describe!='请求成功'){
								uni.showToast({
								  title: '请稍后再试',
								  duration: 2000,
									icon:'none'
								});
								return
							}
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
											icon:'none'
										});
										that.getList(0)
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
				})
			},
			// 退款
			toRefund(item){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/requestARefund',
					method: 'POST',
					data: {
						orderId: item.pid
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
							  title: '申请成功！',
							  duration: 2000,
								icon:'none'
							});
							that.getList(0)
						}
					}
				})
			},
			// 取消订单
			toCancel(id){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/cancelOrder',
					method: 'POST',
					data: {
						orderId: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
							  title: '取消成功！',
							  duration: 2000,
								icon:'none'
							});
							that.getList(0)
						}
					}
				})
			},
			cancelOrder(item){
				let that = this
				uni.showModal({
					title: '提示',
					content: '您确定要取消订单吗？',
					success: function (res) {
						if (res.confirm) {
							that.toCancel(item.pid)
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			getList(type){
				uni.showLoading({
					title: '加载中'
				});
				let that = this
				let shopid = wx.getStorageSync('shopid')
				let userid = wx.getStorageSync('userid')
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/getOrdersByOrderStatus',
					method: 'POST',
					header: {
						'content-type': "application/json"
					},
					data: {
						orderStatus: type,
						shopId: shopid,
						userId: userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.hideLoading();
							that.list=res.Data
							that.list.forEach((it) => {
								it.orderDetails.forEach((item) => {
									var tp = item.images.split(',')
									item.images = tp[0]
								})
							})
						}
					}
				})
			},
			getOrder(){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/orderStatusList',
					method: 'GET',
					success: res => {
						if (res.ResultCode === 0) {
							that.tabList=res.Data
							this.getList(that.tabIndex)
						}
					}
				})
			},
			handleTab(item){
				this.tabIndex=Number(item.value)
				this.getList(item.value)
				uni.pageScrollTo({
					scrollTop:0,
				})
			},
			toDetail(item){
				uni.navigateTo({
					url:'/packageUser/order/orderDetail?id='+item.pid
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-top{
		background-color: #fff;
		z-index: 10;
		position: fixed;
		top: 0;
		width: 100%;
	}
	.switch-head{
		width: 100%;
		height: 100rpx;
		background: #FFFFFF;
		margin-bottom: 16rpx;
	}
	.list-box{
		padding-bottom: 30rpx;
	}
	.list-item{
		background-color: #fff;
		width: 100%;
		padding: 0 25rpx;
		margin-bottom: 18rpx;
		.item-head{
			height: 82rpx;
			border-bottom: 1rpx solid #F5F5F5;
			margin-bottom: 42rpx;
			.tag{
				width: 58rpx;
				height: 34rpx;
				background: rgba(0,0,0,0.1);
				border-radius: 4rpx;
				font-size: 20rpx;
				font-family: PingFang SC;
				text-align: center;
				line-height: 34rpx;
			}
			.addr{
				font-size: 26rpx;
				font-family: PingFang SC;
				color: #666666;
				padding-left: 17rpx;
			}
			.status{
				font-size: 26rpx;
				font-family: PingFang SC;
			}
			.done{
				color: #999999;
			}
		}
	}
	.total-item{
		margin-bottom: 38rpx;
		.time{
			font-size: 24rpx;
			font-family: PingFang SC;
			color: #999999;
		}
		.total{
			text-align: right;
			font-family: PingFang SC;
			.tip{
				font-size: 24rpx;
				color: #666666;
			}
			.price{
				font-size: 30rpx;
				color: #333;
				padding-left: 24rpx;
			}
		}
	}
	.btns{
		padding-bottom: 23rpx;
		.btn{
			padding: 0;
			margin: 0;
			width: 138rpx;
			height: 52rpx;
			border-radius: 26rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			margin-right: 35rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			&:last-child{
				margin-right: 0;
			}
		}
		.ordinary{
			border: 2px solid #999999;
			color: #999999;
		}
		.btn-bg{
			background: #333333;
			color: #FFFFFF;
		}
	}
	.empty-box{
		padding-top: 80rpx;
	}
	/deep/ .info-title{
		.price{
			font-size: 30rpx !important;
		}
	}
	/deep/ .u-modal{
		&__title{
			font-size: 28rpx !important;
		}
		&__content__text{
			font-size: 26rpx !important;
		}
		&__button-group__wrapper__text{
			font-size: 26rpx !important;
		}
		&__button-group__wrapper{
			height: 60rpx !important;
		}
	}
</style>