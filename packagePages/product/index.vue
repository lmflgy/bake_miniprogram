<template>
	<view class="detail-page">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar bgColor="transparent" :toHome="toHome"></commonNavbar>
		</view>
		<view class="detail-banner">
			<u-swiper
			  :list="list3"
			  indicator
			  indicatorMode="line"
			  circular
				height="1000rpx"
				radius="0"
				indicatorStyle="bottom:50rpx"
			></u-swiper>
		</view>
		<view class="detail-box">
			<view class="detail-main" v-if="info">
				<view class="main-top">
					<view class="main-title">
						{{info.goodsName}}
					</view>
					<view class="u-flex u-row-between">
						<text class="main-des main-des-lt u-flex-1">{{info.content}}</text>
						<text class="main-des">已售 {{info.productSales || 0}}</text>
						<view class="main-des main-des-share u-flex" @click="toShare" v-if="false">
							<u-icon name="share" color="#666"></u-icon>
							<text>分享</text>
						</view>
					</view>
				</view>
				<view v-if="info.isMore==0">
				<view class="main-spec" v-if="specList">
					<view class="main-title">规格</view>
					<view class="spec-box">
						<view class="spec-item" v-for="(item,index) in specList" :key="index" @click="handleSpec(item,index)" :class="specId==item.pid?'spec-active':''">
							<text>{{item.groupName}}</text>
							<text class="nn">（{{item.remark}}人吃）</text>
						</view>
					</view>
				</view>
				<view class="main-sandwich" v-if="sandwichList">
					<view class="main-title">夹心</view>
					<view class="spec-box u-flex u-flex-wrap">
						<view class="spec-item" v-for="(item,index) in sandwichList" :key="index" @click="handleSandwich(item,index)" :class="sandwichId==item.sandwichId?'spec-active':''">
							{{item.sandwichName}}
							<view v-if="item.tag" class="jia-xin">{{item.tag?item.tag:''}}</view>
						</view>
					</view>
				</view>
				<view v-if="false">
					<view class="main-title">关联套餐</view>
					<scroll-view scroll-x="true">
						<view class="main-package">
							<view class="package-item" v-for="(item,i) in info.goodsMealVos" :key="i">
								<image class="photo" :src="item.imgUrl"></image>
								<view class="detail">
									<view class="title">{{item.goodsName}}</view>
									<view class="tips">{{item.content}}</view>
									<view class="price">
										<text>¥</text>
										<text class="num">{{item.price}}</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-if="rel != null && rel.length > 0">
					<view class="rel-title">
						<image class="zan" src="@/static/v2/goods-good.png"></image>
						<rich-text :nodes="tuijian"></rich-text>
					</view>
					<view class="rel-wrap">
						<view class="rel-item" v-for="(item,i) in rel" :key="i" @click="go(item)">
							<image class="img" :src="item.imgUrl"></image>
							<view class="detail">
								<view class="t1">{{item.goodsName}}</view>
								<view class="tips">{{item.content}}</view>
								<view class="price">
									<text>¥</text>
									<text class="num">{{item.mealPrice}}</text>
									<text class="del">¥{{item.oldPrice}}</text>
								</view>
								<view class="cart">
									<image class="ic" src="@/static/v2/goods-js.png" @click.stop="relJS(i)" v-if="item.chooseNum > 0"></image>
									<text class="in" v-if="item.chooseNum > 0">{{item.chooseNum}}</text>
									<image class="ic" src="@/static/v2/goods-add.png" @click.stop="relZJ(i)"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="bottom-price u-flex u-row-between">
				<view class="">
					<text class="price-item">¥
						<text class="price">{{(price*number+relPrice).toFixed(2)}}</text>
					</text>
					<text class="spec">{{specName+' '+sandwichName}}</text>
				</view>
				<u-number-box :min="1" :max="100" v-model="number">
					<view slot="minus" class="minus u-flex u-col-center u-row-center">
					  <u-icon name="minus" size="24rpx" color="#ccc"></u-icon>
					</view>
					<text slot="input" class="input">
					 {{number}}
					</text>
					<view slot="plus" class="plus u-flex u-col-center u-row-center">
					  <u-icon name="plus" size="24rpx" color="#fff"></u-icon>
					</view>
				</u-number-box>
			</view>
			<view class="bottom-btns u-flex u-row-center">
				<view class="btn" @click="addCart" v-if="isAddCart">加入购物车</view>
				<view class="btn btn-bg" @click="buyNow">立即购买</view>
			</view>
		</view>
		
		<u-popup :show="shareShow" @close="shareShow=false" mode="center" closeable :round="'18rpx'" :safeAreaInsetBottom="false">
			<!-- <image :src="shareImg" mode="" show-menu-by-longpress="true" class="share-img"></image> -->
			<image :src="shareImg" mode="" @longpress="saveImage" class="share-img"></image>
			<view class="share-tip">
				<text>长按保存图片</text>
			</view>
		</u-popup>
		<view class="pop-wrap" :class="isWarnFlag?'active':''">
			<view class="pop-dialog">
				<text class="title">-温馨提醒-</text>
				<text class="tips">该夹心需要提前2天预定哦</text>
				<view class="btn" @click="isWarnFlag=false">我知道了</view>
			</view>
		</view>
	</view>
</template>
<!--G1680128891437584384-->
<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				list3: [
				  // 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				  // 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
				  // 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
				specList:[],
				specId: null,
				specName:'',
				sandwichList:[],
				sandwichId: null,
				sandwichName: '',
				number: 1,
				info: {},
				rel: [],
				price: 0,
				relPrice: 0,
				// totalPrice: 0,
				productId: '',
				takeType: '',
				toHome: false,
				shareImg: '',
				shareShow: false,
				isWarnFlag: false,
				size: [],
				sand: [],
				isAddCart: true,
				tuijian: '为你推荐优惠搭配'
			};
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onLoad:function(option){
			this.loadSize()
			this.loadTitle()
			this.loadSand()
			if(option.scene){
				let query = decodeURIComponent(option.scene)
				let data =query.split('=')
				this.getInfo(data[1])
				this.productId = data[1]
				this.takeType=0
				this.toHome=true
				// that.SetLogin(true)
				// console.log('scene',query, data[1])
			}else{
				this.productId = option.pid
				this.takeType=option.type||0
				this.getInfo(option.pid)
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
			...mapMutations(['SetLogin']),
			relJS(i){
				if(this.rel[i].chooseNum > 0){
					this.rel[i].chooseNum = parseInt(this.rel[i].chooseNum) - 1
					this.countSum()
					// 判断是否全部都清除了
					let isAll = 0
					this.rel.forEach((item) => {
						if(item.chooseNum > 0){
							isAll ++
						}
					})
					this.isAddCart = isAll == 0
				}
			},
			go(item){
				uni.navigateTo({
					url: '/packagePages/product/index?pid='+item.goodsId+'&type='+this.takeType
				})
			},
			relZJ(i){
				this.isAddCart = false
				this.rel[i].chooseNum = parseInt(this.rel[i].chooseNum) + 1
				this.countSum()
			},
			loadTitle(){
				let that = this
				this.$http.fetchData({
					url: '/front/user/bake/goodsMgr/getTuijian',
					method: 'GET',
					data: {},
					success: res => {
						if (res.ResultCode === 0) {
							that.tuijian = res.Data
						}
					}
				})
			},
			loadSize(){
				let shopid = wx.getStorageSync('shopid')
				let that = this
				that.$http.fetchData({
					url: '/front/merchant/server/sellEndManageList',
					method: 'GET',
					data: {
						type: 1,
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.size = res.Data
						}
					}
				})
			},
			loadSand(){
				let shopid = wx.getStorageSync('shopid')
				let that = this
				that.$http.fetchData({
					url: '/front/merchant/server/sellEndManageList',
					method: 'GET',
					data: {
						type: 2,
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.sand = res.Data
						}
					}
				})
			},
			toShare(){
				let token = wx.getStorageSync('token')
				if(!token){
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					setTimeout(function(){
						uni.navigateTo({
							url:'/packageUser/login/login'
						})
					},1500)
					return
				}
				uni.showLoading({
					title: '加载中'
				});
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/generateProductPosters',
					method: 'GET',
					data: {
						pid: that.productId
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.shareImg=res.ResultInfo
							uni.hideLoading();
							that.shareShow=true
						}
					}
				})
			},
			saveImage(e){
				let that = this
				let url = that.shareImg
				wx.getSetting({
					success: (res) => {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							wx.authorize({
				        scope: 'scope.writePhotosAlbum',
				        success: () => {
				          // 同意授权
				          that.saveImgInner(url);
				        },
				        fail: (res) => {
				          console.log(res);
				          wx.showModal({
				            title: '保存失败',
				            content: '请开启访问手机相册权限',
				            success(res) {
				              wx.openSetting()
				            }
				          })
				        }
				      })
				    } else {
				      // 已经授权了
				      that.saveImgInner(url);
				    }
				  },
				  fail: (err) => {
				    console.log(err);
					}
				})
			},
			// 长按保存功能--保存部分
			saveImgInner (url) {
				uni.showLoading({
					title: '保存中'
				});
			  wx.getImageInfo({
			    src: url,
			    success: (res) => {
			      let path = res.path;
			      wx.saveImageToPhotosAlbum({
			        filePath: path,
			        success: (res) => {
					uni.hideLoading()
			          wx.showToast({
			            title: '已保存到相册',
			          })
			        },
			        fail: (res) => {
			            console.log(res);
						uni.hideLoading()
						wx.showToast({
						  title: '保存失败',
							icon: 'error'
						})
			        }
			      })
			    },
			    fail: (res) => {
			      console.log(res);
			    }
			  })
			},
			getInfo(id){
				uni.showLoading({ title: '加载中' });
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/getInfo',
					method: 'GET',
					data: {
						pid: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.info=res.Data
							if(res.Data.bakeSpecifications != null && res.Data.bakeSpecifications.length > 0){
								that.specList=res.Data.bakeSpecifications
								that.sandwichList=res.Data.bakeSpecifications[0].sandwich
								that.specId=res.Data.bakeSpecifications[0].pid
								this.specName=res.Data.bakeSpecifications[0].groupName
							}
							if(res.Data.isMore == 0){
								that.price=res.Data.bakeSpecifications[0].price
							}else{
								that.price=res.Data.oldPrice
							}
							res.Data.arrayimages.forEach(item=>{
								that.list3.push(that.$http.ossUrl+item)
							})
							if(that.info.goodsMealVos != null && that.info.goodsMealVos.length > 0){
								let rel = []
								that.info.goodsMealVos.forEach((item) => {
									item.imgUrl = that.$http.ossUrl+item.imgUrl.split(',')[0]
									let rl = {
										imgUrl: item.imgUrl,
										chooseNum: 0,
										goodsId: item.goodsId,
										goodsName: item.goodsName,
										content: item.content,
										oldPrice: item.oldPrice,
										mealPrice: item.mealPrice
									}
									rel.push(rl)
								})
								that.rel = rel
							}
							uni.hideLoading();
						}
					}
				})
			},
			countSum(){
				let price = 0
				this.rel.forEach((item) => {
					if(item.chooseNum > 0){
						price += item.chooseNum * item.mealPrice
					}
				})
				this.relPrice = price
			},
			handleSpec(item,index){
				// 判断是否售罄
				if(this.size != null && this.size.length > 0){
					let it = this.size.find(d=>d.name==item.groupName)
					if(it){
						if(it.status == 1){
							uni.showToast({
								title: it.name + '蛋糕今日已售罄',
								icon: 'none'
							})
							return
						}
					}
				}
				this.specId=item.pid
				this.specName=item.groupName
				this.sandwichId=null
				this.price=item.price
				this.sandwichList=item.sandwich
			},
			handleSandwich(item,index){
				// 判断是否售罄
				if(this.sand != null && this.sand.length > 0){
					let it = this.sand.find(d=>d.sandwichId==item.sandwichId)
					if(it){
						if(it.status == 1){
							uni.showToast({
								title: it.sandwichName + '今日已售罄',
								icon: 'none'
							})
							return
						}
					}
				}
				this.sandwichId=item.sandwichId
				this.sandwichName=item.sandwichName
				this.price=item.price
				if(item.warnFlag=="1"){
					this.isWarnFlag = true
				}
			},
			buyNow(){
				// 判断是否售罄
				if(this.size != null && this.size.length > 0){
					let gname = ''
					this.specList.forEach((item) => {
						if(item.pid == this.specId){
							gname = item.groupName
						}
					})
					let it = this.size.find(d=>d.name==gname)
					if(it){
						if(it.status == 1){
							uni.showToast({
								title: it.name + '蛋糕今日已售罄',
								icon: 'none'
							})
							return
						}
					}
				}
				let that = this
				if(that.info.isMore == 0){
					if(!that.specId){
						uni.showToast({
						  title: '请选择规格！',
						  duration: 2000,
							icon:'none'
						});
						return
					}
					if(!that.sandwichId){
						uni.showToast({
						  title: '请选择夹心！',
						  duration: 2000,
							icon:'none'
						});
						return
					}
				}
				that.info.specName=that.specName
				that.info.sandwichName=that.sandwichName
				that.info.num=that.number
				that.info.price=that.price
				that.info.totalPrice=that.price*that.number
				that.info.goodsId=that.info.pid
				that.info.sandWichId=that.sandwichId
				that.info.specId=that.specId
				let list = []
				list.push(that.info)
				if(that.rel != null && that.rel.length > 0){
					that.rel.forEach((it) => {
						if(it.chooseNum > 0){
							var relModel = {
								specName: '',
								sandwichName: '',
								sandWichId: '',
								specId: '',
								isSpec: true,
								goodsId: it.goodsId,
								goodsName: it.goodsName,
								images: it.imgUrl,
								price: it.mealPrice,
								num: it.chooseNum,
								totalPrice: it.mealPrice * it.chooseNum
							}
							list.push(relModel)
						}
					})
				}
				wx.setStorageSync('orderData',list)
				
				if(that.takeType == 4){
					uni.navigateTo({
						url: '/packagePages/order/tangShi?type='+that.takeType
					})
				}else{
					uni.navigateTo({
						url: '/packagePages/order/settlement?type='+that.takeType
					})
				}
				
			},
			addCart(){
				// 判断是否售罄
				if(this.size != null && this.size.length > 0){
					let gname = ''
					this.specList.forEach((item) => {
						if(item.pid == this.specId){
							gname = item.groupName
						}
					})
					let it = this.size.find(d=>d.name==gname)
					if(it){
						if(it.status == 1){
							uni.showToast({
								title: it.name + '蛋糕今日已售罄',
								icon: 'none'
							})
							return
						}
					}
				}
				let that = this
				if(that.info.isMore == 0){
					if(that.specId==null){
						uni.showToast({
						  title: '请选择规格！',
						  duration: 2000,
							icon:'none'
						});
						return
					}
					if(that.sandwichId==null){
						uni.showToast({
						  title: '请选择夹心！',
						  duration: 2000,
							icon:'none'
						});
						return
					}
				}
				let shopid = wx.getStorageSync('shopid')
				let userid = wx.getStorageSync('userid')
				let total = that.price*that.number
				let relIds = []
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/AddToShoppingCart',
					method: 'POST',
					data: {
						goodsId: that.productId,
						num: that.number,
						pirce: that.price,
						sandwichId: that.sandwichId,
						shopId: shopid,
						specId: that.specId,
						totalPrice: total,
						userId: userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
							  title: '添加成功！',
							  duration: 2000,
								icon:'success'
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rel-wrap{
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 26rpx 0;
		background-color: #F7F7F7;
		border-radius: 8rpx;
		margin: 30rpx 0;
		.rel-item{
			width: 100%;
			display: flex;
			margin-top: 32rpx;
			padding: 0 20rpx;
			.detail{
				flex: 1;
				display: flex;
				flex-direction: column;
				position: relative;
				justify-content: space-between;
				padding: 8rpx 0;
				overflow: hidden;
				.cart{
					position: absolute;
					right: -5rpx;
					bottom: 0;
					display: flex;
					align-items: center;
					.ic{
						width: 40rpx;
						height: 40rpx;
						display: block;
					}
					.in{
						min-width: 60rpx;
						line-height: 40rpx;
						display: block;
						text-align: center;
						padding: 0 20rpx;
						font-size: 28rpx;
					}
				}
				.t1{
					width: 100%;
					display: block;
					font-size: 26rpx;
					font-weight: bold;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.tips{
					width: 100%;
					display: block;
					color: #999;
					font-size: 26rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.price{
					font-size: 34rpx;
					font-family: DIN Alternate;
					font-weight: bold;
					.del{
						font-size: 24rpx;
						text-decoration: line-through;
						color: #999999;
						margin-left: 15rpx;
					}
				}
			}
			.img{
				width: 140rpx;
				height: 140rpx;
				display: block;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}
		}
		.rel-item:first-child{
			margin-top: 0;
		}
	}
	.rel-title{
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: bold;
		margin-top: 30rpx;
		.zan{
			width: 30rpx;
			height: 30rpx;
			display: block;
			margin-right: 12rpx;
		}
	}
	.main-package{
		width: 100%;
		height: 182rpx;
		display: flex;
		white-space: nowrap;
		flex-wrap: nowrap;
		.package-item{
			width: 500rpx;
			height: 182rpx;
			overflow: hidden;
			display: flex;
			border: 1px solid #EFEFEF;
			border-radius: 8rpx;
			margin-left: 32rpx;
			padding: 22rpx;
			.photo{
				width: 140rpx;
				height: 140rpx;
				display: block;
				border-radius: 8rpx;
			}
			.detail{
				flex: 1;
				display: flex;
				margin-left: 22rpx;
				flex-direction: column;
				justify-content: space-between;
				.title{
					width: 100%;
					display: block;
					font-size: 34rpx;
					font-weight: 700;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.tips{
					width: 100%;
					display: block;
					color: #999;
					font-size: 26rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.price{
					font-size: 30rpx;
					font-family: DIN Alternate;
					font-weight: bold;
					.num{
						font-size: 38rpx;
					}
				}
			}
		}
		.package-item:first-child{
			margin-left: 0;
		}
	}
	.pop-wrap{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		visibility: hidden;
		transition: all .3s;
		.pop-dialog{
			width: 600rpx;
			height: 440rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			border-radius: 8rpx;
			.title{
				font-size: 34rpx;
				font-weight: 700;
				margin-top: 20rpx;
			}
			.tips{
				font-size: 30rpx;
				margin: 65rpx 0 140rpx 0;
			}
			.btn{
				width: 150rpx;
				height: 54rpx;
				display: block;
				text-align: center;
				line-height: 54rpx;
				background-color: #333;
				border-radius: 27rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #fff;
			}
		}
	}
	.pop-wrap.active{
		opacity: 1;
		visibility: visible;
	}
	.page-top{
		position: absolute;
		z-index: 10;
	}
	.detail-box{
		position: relative;
	}
	.detail-main{
		width: 100%;
		background-color: #fff;
		padding: 0 25rpx;
		padding-bottom: 52rpx;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
		position: absolute;
		top: 0;
		padding-bottom: 280rpx;
	}
	.main-top{
		padding: 47rpx 0 40rpx;
		font-family: PingFang SC;
		border-bottom: 1rpx solid #f6f6f6;
	}
	.main-title{
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		padding-bottom: 26rpx;
	}
	.main-des{
		font-size: 26rpx;
		color: #000;
		&-lt{
			// width: 80%;
			padding-right: 24rpx;
		}
		&-share{
			margin-left: 20rpx;
			>text{
				padding-left: 5rpx;
			}
		}
	}
	.main-spec{
		padding: 42rpx 0 24rpx;
	}
	.spec-item{
		font-size: 28rpx;
		font-family: PingFang SC;
		color: #000;
		// width: 276rpx;
		padding: 0 47rpx;
		height: 61rpx;
		border: 2rpx solid #EFEFEF;
		margin: 0 47rpx 27rpx 0;
		display: inline-block;
		border-radius: 8rpx;
		text-align: center;
		line-height: 61rpx;
		
		.nn{
			font-size: 24rpx;
			color: #000;
		}
	}
	.spec-active{
		color: #333333;
		font-weight: bold;
		background: rgba(204,204,204,0.15);
		border-color: #333333;
	}
	.main-sandwich{
		.spec-item{
			// margin-right: 0;
			padding: 0 45rpx;
			position: relative;
			.jia-xin{
				min-width: 50rpx;
				position: absolute;
				    right: -20rpx;
				    top: -21rpx;
				    font-size: 22rpx;
				    color: #d4734b;
				    background: #fdebe5;
				    border-radius: 20rpx;
				    padding: 0 10rpx;
				    height: 35rpx;
				    line-height: 35rpx;
			}
		}
	}
	.detail-bottom{
		border-top: 1rpx solid #f6f6f6;
		padding: 43rpx 25rpx 33rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		width: 100%;
		.minus{
			width: 36rpx;
			height: 36rpx;
			color: #ccc;
			border-radius: 50%;
			border: 1rpx solid #ccc;
		}
		.plus{
			width: 36rpx;
			height: 36rpx;
			color: #fff;
			border-radius: 50%;
			background-color: #ccc;
		}
		.input{
			width: 58rpx;
			height: 37rpx;
			text-align: center;
			color: #666;
			font-weight: bold;
			font-size: 32rpx;
			line-height: 37rpx;
		}
	}
	.price-item{
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		padding-right: 20rpx;
		.price{
			font-size: 38rpx;
		}
	}
	.spec{
		font-size: 26rpx;
		font-family: PingFang SC;
		color: #999999;
	}
	.bottom-btns{
		margin-top: 35rpx;
	.btn{
		flex: 1;
		height: 68rpx;
		border: 2rpx solid #999999;
		border-radius: 34rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #999999;
		box-sizing: border-box;
		text-align: center;
		line-height: 68rpx;
	}
	.btn+.btn{
		margin-left: 20rpx;
	}
	}
	.btn-bg{
		color: #fff;
		background-color: #333333;
		border: none;
	}
	.share-img{
		width: 540rpx;
		height: 792rpx;
	}
	.share-tip{
		font-size: 28rpx;
		font-family: PingFang SC;
		text-align: center;
		padding: 20rpx;
		color: #666;
	}
</style>