<template>
	<view class="order-detail">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="我的订单"></commonNavbar>
		</view>
		<view :style="{'height':statusBarHeight+44+'px'}"></view>
		<view class="status-item">
			<view class="status" v-if="info.orderStatus==0">待付款</view>
						<view class="status" v-if="info.orderStatus==1">制作完成</view>
						<view class="status" v-if="info.orderStatus==2">骑手接单中</view>
						<view class="status" v-if="info.orderStatus==3">已完成</view>
						<view class="status" v-if="info.orderStatus==4">已取消</view>
						<view class="status" v-if="info.orderStatus==5">待退款</view>
						<view class="status" v-if="info.orderStatus==6">已退款</view>
						<view class="status" v-if="info.orderStatus==7">{{info.orderType == 4?info.orderSortNo:'待接单'}}</view>
						<text class="status" v-if="info.orderStatus==8">制作中</text>
						<view class="status" v-if="info.orderStatus==9">退款中</view>
						<view class="status" v-if="info.orderStatus==11">配送中</view>
			
			<view class="count-time u-flex u-row-center" v-if="info.orderStatus==0">
				剩余支付时间：
				<!-- <u-count-down :time="1800000" format="mm:ss"></u-count-down> -->
				<u-count-down :time="info.remainingPaymentTime" format="mm:ss"></u-count-down>
			</view>
			<view class="count-time" v-if="info.orderStatus==2">
				您的商品正在等待骑手接单中 请耐心等等
			</view>
			<view class="count-time" v-if="info.orderStatus==3">
				感谢您对我们的喜欢和支持
			</view>
			<view class="count-time" v-if="info.orderStatus==1">
				您的商品制作已完成 请您按时提货哦
			</view>
			<view class="count-time" v-if="info.orderStatus==11">
				您的商品正在配送中 请耐心等等
			</view>
			
			<view class="btns u-flex u-row-center">
				<view class="btn ordinary" v-if="info.orderStatus>=3&&info.orderStatus!=7" @click="addToCart">再来一单</view>
				<view class="btn ordinary" v-if="info.orderStatus<1" @click="cancelOrder">取消订单</view>
				<view class="btn btn-bg" v-if="info.orderStatus==0" @click="toPay">去支付</view>
				<view class="status" v-if="info.orderStatus==7 && info.orderType == 4">取餐码</view>
				<view class="btn btn-bg" v-else-if="info.orderStatus==7||info.orderStatus==8" @click="toRefund">申请退款</view>
			</view>
		</view> 
		<view class="addr-item">
			<view class="u-flex u-row-between">
				<text class="name" v-if="info.orderType==1">{{info.shopName}} </text>
				<text class="name" v-if="info.orderType==2||info.orderType==3">{{info.address.replace('undefined','')}} </text>
				<image src="../../static/order/phone.png" mode="" class="icon" @click="call(info.concat)" v-if="info.orderType==1"></image>
				<image src="../../static/edit.png" mode="" class="icon" @click="toAddr" v-if="info.orderType==2&&(info.orderStatus==1||info.orderStatus==7)"></image>
			</view>
			<view class="addr" v-if="info.orderType==1">
				{{info.deliveryAddress}}
			</view>
			<view class="addr" v-if="info.orderType==2||info.orderType==3">
				{{info.name}}{{info.sex}}士 {{info.phone}}
			</view>
			<view class="addr" v-if="info.orderType==2">
				预计送达时间: {{info.estimatedDeliveryTime}}
			</view>			
		</view>
		<view class="addr-item" v-if="sendData!=null">
			<view class="u-flex u-row-between">
				<text class="name">闪送信息</text>
				<text class="status">{{sendData.orderStatusDesc}}</text>
			</view>
			<view class="addr" v-if="sendData.msg">
				{{sendData.msg}}
			</view>
			<view class="addr">
				{{sendData.name}} {{sendData.mobile}}
			</view>		
		</view>
		<view class="list">
			<view class="list-head" v-if="info.orderType==3">
				<text>快递订单 {{info.orderNo}}</text>
				<image src="../../static/order/copy.png" mode="" class="icon" @click="copy(info.orderNo)"></image>
			</view>
			<view class="list-head" v-else>
				<text v-if="info.orderType==1">自提订单 {{info.orderNo}}</text>
				<text v-else-if="info.orderType==4">堂食订单 {{info.orderNo}}</text>
				<text v-else>配送订单 {{info.orderNo}}</text>
				<!-- <text>{{info.orderType==1?'自提':'配送'}}订单 {{info.orderNo}}</text>
				<text>{{info.orderType==1?'自提':'配送'}}订单 {{info.orderNo}}</text> -->
				<image src="../../static/order/copy.png" mode="" class="icon" @click="copy(info.orderNo)"></image>
			</view>
			<order-list :list="info.bakePickUpOrderDetailVos"></order-list>
		</view>
		<view class="other">
			<view class="other-item u-flex u-row-between" v-if="info.orderType == 3">
				<text class="title">快递费</text>
				<text class="text">￥{{info.shansongPrice}}</text>
			</view>
			<view class="other-item u-flex u-row-between">
				<text class="title">下单时间</text>
				<text class="text">{{info.createTime}}</text>
			</view>
			<view class="other-item u-flex u-row-between" v-if="info.orderType == 3 && info.wuliuOrderNo">
				<text class="title">快递单号</text>
				<text class="value">{{info.wuliuOrderNo}}</text>
				<image src="../../static/order/copy.png" mode="" class="icon" @click="copy(info.wuliuOrderNo)"></image>
			</view>
			<view class="other-item u-flex u-row-between" v-if="info.orderType==1">
				<text class="title">取货时间</text>
				<text class="text">{{info.pickuptime}} </text>
			</view>
			<view class="other-item u-flex u-row-between">
				<text class="title">餐具选择</text>
				<text class="text">{{info.tableware}}</text>
			</view>
			<view class="other-item u-flex u-row-between">
				<text class="title">贺卡内容</text>
				<text class="text">{{info.greetingCard}}</text>
			</view>
			<view class="other-item u-flex u-row-between">
				<text class="title">备注信息</text>
				<text class="text">{{info.message}}</text>
			</view>
			<view class="photo-list">
				<image class="photo-item" v-for="(item,i) in path" :src="item" @tap="showPrev(i)" />
			</view>
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
				orderId: '',
				info: '',
				sendData: null,
				path: []
			};
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onLoad:function(option){
			this.orderId=option.id
			this.getDetail(this.orderId)
			wx.showShareMenu({
			  withShareTicket: true,
			  menus: ["shareAppMessage"],
			});
		},
		mounted() {
			
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
		onShow() {
			let addr = wx.getStorageSync('addrchange')
			if(addr){
				console.log('改变地址')
				this.judgeChange()
			}
		},
		beforeDestroy() {
			wx.removeStorageSync('addrchange')
		},
		onShareTimeline: function (res) {
		  var that = this;	
		  return {
		    title: `more to luv生日蛋糕`,
		    // imageUrl: `https://bbs.txwb.com/images/wmapp/share.jpg`,
		    query: "id="+this.orderId,
		    success: function (res) { },
		  };
		},
		onShareAppMessage: function (res) {
		  return {
		    title: `more to luv生日蛋糕`,
		    // imageUrl: `https://bbs.txwb.com/images/wmapp/share.jpg`,
		    path: "/packageUser/order/orderDetail?id="+this.orderId ,
		    success: function (res) { },
		  };
		},
		methods:{
			showPrev(i){
				uni.previewImage({
					urls: this.path,
					current: i
				})
			},
			judgeChange(){
				let addr = wx.getStorageSync('defaultAddr')
				let that = this
				that.$http.fetchData({
					url:'/front/user/bake/orderMgr/getEditAddressStatus',
					method:'GET',
					header: {
						'content-type': "application/json"
					},
					data: {
						orderId: that.orderId,
						lat: addr.lat,
						lng: addr.lng
					},
					success: res => {
						if(res.ResultCode == 0){
							if(res.Data){
								that.changeAddr()
							}else{
								wx.removeStorageSync('addrchange')
								// 距离太远不能切换
								uni.showModal({
									content:'当前地址和旧地址差距太大，不支持更换哦',
									showCancel:false
								})
							}
						}
					}
				})
			},
			getShansong(){
				let that = this
				this.$http.fetchData({
					url:'/front/merchant/bake/orderMgr/getShanSongOrderInfo',
					method: 'GET',
					header: {
						'content-type': "application/json"
					},
					data: {
						orderId: that.orderId
					},
					success: res => {
						if(res.ResultCode == 0 && !uni.$u.test.isEmpty(res.Data)){
							that.sendData = res.Data
						}
					}
				})
			},
			changeAddr(){
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
						orderId: that.orderId
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
							  title: '修改成功！',
							  duration: 2000,
								icon:'success'
							});
							wx.removeStorageSync('addrchange')
							this.getDetail(this.orderId)
						}
					}
				})
			},
			toAddr(){
				uni.navigateTo({
					url:'/packagePages/address/index'
				})
			},
			toPay(){
				let that = this
				let shopid = wx.getStorageSync('shopid')
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/toPay',
					method: 'POST',
					data: {
						orderId: that.info.orderNo,
						shopId: shopid
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
									console.log(res)
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
			toRefund(){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/requestARefund',
					method: 'POST',
					data: {
						orderId: that.info.orderNo
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
							  title: '申请成功！',
							  duration: 2000,
								icon:'none'
							});
							that.getDetail(this.orderId)
						}
					}
				})
			},
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
							that.getDetail(this.orderId)
						}
					}
				})
			},
			cancelOrder(){
				let that = this
				uni.showModal({
					title: '提示',
					content: '您确定要取消订单吗？',
					success: function (res) {
						if (res.confirm) {
							that.toCancel(that.info.orderNo)
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			getDetail(id){
				uni.showLoading({
					title: '加载中'
				});
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/getOrderDetail',
					method: 'GET',
					data: {
						orderId: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.hideLoading();
							that.info=res.Data
							if(res.Data.imgUrl){
								that.path = JSON.parse(res.Data.imgUrl)
							}
							if(that.info.orderType != 1){
								that.getShansong()
							}
							that.info.bakePickUpOrderDetailVos.forEach((item) => {
								var tp = item.images.split(',')
								item.images = tp[0]
							})
						}
					}
				})
			},
			copy(item){
				uni.setClipboardData({
					data: item,
					success: function () {
						uni.showToast({
						  title: '已复制',
						  duration: 2000,
							icon:'none'
						});
					}
				});
			},
			call(item){
				uni.makePhoneCall({
					phoneNumber: item
				});
			},
			// 再来一单
			addToCart(){
				let that = this
				let shopid = wx.getStorageSync('shopid')
				that.$http.fetchData({
					url: '/front/user/bake/orderMgr/oneMoreOrder',
					method: 'POST',
					data: {
						orderId: that.orderId,
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
		}
	}
</script>

<style lang="scss" scoped>
	.photo-list{
	    width: 100%;
	    display: flex;
	    flex-wrap: wrap;
	    .photo-item{
	        width: 200rpx;
	        height: 200rpx;
	        display: block;
	        border-radius: 4rpx;
	        margin: 20rpx 20rpx 0 0;
	    }
	    .photo-item:nth-child(3n){
	        margin-right: 0;
	    }
	}
	.page-top{
		background-color: #fff;
		z-index: 10;
		position: fixed;
		top: 0;
		width: 100%;
	}
	.order-detail{
		padding-bottom: 50rpx;
	}
	.status-item{
		background-color: #fff;
		padding: 37rpx 0 47rpx;
		width: 100%;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.status{
			text-align: center;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			padding-bottom: 27rpx;
		}
		.count-time{
			font-size: 28rpx;
			font-family: PingFang SC;
			color: #333333;
			margin-bottom: 42rpx;
			text-align: center;
			/deep/ .u-count-down__text{
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
			}
		}
		.btns{
			.btn{
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
	}
	.addr-item{
		background-color: #fff;
		padding: 30rpx 27rpx 35rpx;
		margin: 0 25rpx 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		.name{
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.status{
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
		}
		.icon{
			width: 34rpx;
			height: 34rpx;
		}
		.addr{
			font-size: 26rpx;
			font-family: PingFang SC;
			color: #999999;
			padding-top: 22rpx;
		}
	}
	.list{
		padding: 50rpx 27rpx 0;
		background-color: #fff;
		margin: 20rpx 25rpx 0;
		&-head{
			font-size: 26rpx;
			font-family: PingFang SC;
			color: #666666;
			padding-bottom: 47rpx;
			.icon{
				width: 28rpx;
				height: 28rpx;	
				margin-left: 20rpx;
			}
		}
	}
	.other{
		background-color: #fff;
		margin: 20rpx 25rpx 0;
		padding: 37rpx 28rpx 27rpx;
		&-item{
			padding-bottom: 27rpx;
			font-family: PingFang SC;
			font-size: 28rpx;
			.title{
				color: #333333;
			}
			.text{
				color: #999999;
				display: inline-block;
				max-width: 470rpx;
				text-align: right;
			}
			.value{
				flex: 1;
				text-align: right;
				color: #999999;
			}
			.icon{
				width: 28rpx;
				height: 28rpx;
				margin-left: 20rpx;
			}
		}
	}
</style>