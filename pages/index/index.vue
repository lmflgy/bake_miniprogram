<template>
	<view>
	<view class="content">
		<view class="" :style="{height:statusBarHeight+'px',background:'#fff',position: 'fixed'}"></view>
		<uni-nav-bar :border="false" leftWidth="500rpx" fixed :height="88" >
			<!-- <block slot="left">
				<image src="../../static/logo-l.png" mode="aspectFill" class="nav-logo" ></image>
			</block> -->
		</uni-nav-bar>
		<!--date:2023-07-15,by:Life-->
		<view class="index-shop" @click="gotoShop">
			<image class="index-shop-rt" src="../../static/shop-location.png"></image>
			<view class="index-shop-lt">当前所在门店：{{nowShop}}</view>
		</view>
		<!--date:2023-07-15,by:Life-->
		<view class="index-page" :style="{height:screenHeight+'px'}">
			<u-swiper
				:list="list3"
				keyName="images"
				indicator
				circular
				:height="screenHeight*0.6+'px'"
				:autoplay="true"
				@click="selectBanner"
			></u-swiper>
			<view class="index-main u-flex first" :style="{height:screenHeight*0.2+'px'}" >
				<view class="main-item u-flex-1 u-flex-col u-col-center u-row-center left bottom" @click="tolist(4)">
					<image src="../../static/take.png" mode="aspectFill" class="img"></image>
					<view class="title">堂 食</view>
					<view class="tip">
						下午茶
					</view>
				</view>
				<view class="main-item u-flex-1 u-flex-col u-col-center u-row-center bottom" @click="tolist(2)">
					<image src="../../static/takeout.png" mode="aspectFill" class="img"></image>
					<view class="title">自取/外卖</view>
					<view class="tip">
						 蛋糕 花艺 礼物 
					</view>
				</view>
			</view>
			<view class="index-main u-flex" :style="{height:screenHeight*0.2+'px'}">
				<view class="main-item u-flex-1 u-flex-col u-col-center u-row-center left" @click="tolists('/packagePages/introduce/dingZhi')">
					<image src="../../static/dingzhi.png" mode="aspectFill" class="img"></image>
					<view class="title">定制咨询 </view>
					<view class="tip">
						  Party&企业定制
					</view>
				</view>
				<view class="main-item u-flex-1 u-flex-col u-col-center u-row-center" @click="tolists('/packagePages/introduce/index')">
					<image src="../../static/pinpai.png" mode="aspectFill" class="img"></image>
					<view class="title">品牌介绍 </view>
					<view class="tip" style="opacity: 0;"> da
						
					</view>
				</view>
			</view>
			<!-- <view style="height: 20px;"></view> -->
		</view>
	</view>
	</view>
</template>
<!--用户端：wxfd61f419dd1b57c8-->
<!--商家端：wx163e0daadafffc20-->
<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				screenHeight: 0,
				list3: [],
				lng: '',
				lat: '',
				nowShop: '获取中...',
				shops: null,
				isUpdate: true,
				privacyContractName: '《微信隐私保护引导》',
				showPrivacy: false,
				screenHeights:0
			}
		},
		onReady() {
			let that = this
			// 获取手机的屏幕高度
			
				// setTimeout(()=>{
					uni.getSystemInfo({
						success: (res) => {
							console.log(1111)
							that.statusBarHeight = res.statusBarHeight
							that.screenHeight = res.windowHeight-res.statusBarHeight-88
							this.screenHeights = that.screenHeight+20
						}
					})
				// },1000)
			
		},
		onLoad(option) {	
			
			console.log(option);
			if(option.scene){
				let query = decodeURIComponent(option.scene)
				let data =query.split('&')
				let id = data[0].split('=')[1]
				wx.setStorageSync('shopid',id)
				this.getShopInfo(id)
				wx.setStorageSync('isScan',true)
				console.log('scene',query, data)
				this.getBanner()
			}
			if(option.code){
				let code = decodeURIComponent(option.code)
				console.log(code);
				let userid = wx.getStorageSync('userid')
				if(userid){
					this.bindCode(code,userid)
				}else{
					wx.setStorageSync('sharecode',code)
				}
			}
		},
		onShow() {
			this.isUpdate = true
			if(!wx.getStorageSync('isScan')){
				let shop = uni.getStorageSync('shop')
				if(shop){
					this.isUpdate = false
					this.shops = JSON.parse(shop)
					console.log(this.shops);
					this.nowShop = this.shops.name
					this.getShopInfo(this.shops.pid)
					this.getBanner()
				}
				this.getLocation()
			}
		},
		mounted(){
			
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
			bindCode(code,userid){
				this.$http.fetchData({
					url: '/front/userMgr/update',
					data: {
						pid: userid,
						invitationCode: code
					},
					success: res => {
						if(res.ResultCode == 0){
							uni.showToast({ title:'绑定成功' })
						}
					}
				})
			},
			// 定位授权
			getLocation () {
				let that = this
				// 1、判断手机定位服务【GPS】 是否授权
				uni.getSystemInfo({
					success: function (sys) {
						//判断手机定位服务是否开启
						let locationEnabled = sys.locationEnabled
						//判断定位服务是否允许微信授权
						let locationAuthorized = sys.locationAuthorized
						if (locationEnabled == false || locationAuthorized == false) {
							//手机定位服务（GPS）未授权
							uni.showToast({ title: '请打开手机GPS', icon: 'none' })
							return
						}
						// 2、判断微信小程序是否授权位置信息
						uni.authorize({
							scope: "scope.userLocation",
							fail: () => {
								uni.showModal({
									title: '提示',
									content: '需要授权获取地理位置信息',
									confirmText: '确认授权',
									success: function (flag) {
										if (flag) {
											uni.getSetting({
												success: (res) => {
													if (res.authSetting["scope.userLocation"]) {
														uni.showToast({ title: '授权成功', icon: 'none' })
														setTimeout(() => {
															that.getLocationFn(sys)
														}, 1500)
													} else {
														uni.showToast({ title: '授权失败，请重新授权', icon: 'none' })														
														setTimeout(() => {
															uni.showModal({
																title: '授权',
																content: '获取授权定位失败，是否前往授权设置？',
																success: function(flag1){
																	if (flag) {
																		uni.openSetting()
																	}
																}
															})
														}, 1500)
													}
												},
												fail: () => {
													uni.showToast({ title: '系统错误', icon: 'none' })
												}
											})
										} else {
											uni.showToast({ title: '你拒绝了授权，无法获得位置信息', icon: 'none' })
										}
									}
								})
							},
							complete (res) {
								if (res.errMsg == "authorize:ok") {
									that.getLocationFn(sys)
								} else {
									uni.showModal({
										title: '授权',
										content: '获取授权定位失败，是否前往授权设置？',
										success: function(flag1){
											if (flag) {
												uni.openSetting()
											}
										}
									})
								}
							},
						})
					}
				})
	
			},
			// 获取定位
			getLocationFn (sys) {
				let that = this
				uni.getLocation({
					type: 'gcj02',
					cacheTimeout: 30,
					success: function (res) {
						if (sys.platform == "ios") {
							//toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
							that.lng = res.longitude.toFixed(6)
							that.lat = res.latitude.toFixed(6)
						} else {
							that.lng = res.longitude
							that.lat = res.latitude
						}
						// 将经纬度通过后端获取地址名称等信息
						that.getLBSLocation()
					}
				})
			},
			// 通过定位获取最近的门店
			getLBSLocation () {
				uni.setStorageSync('shop_lat',this.lat)
				uni.setStorageSync('shop_lng',this.lng)
				this.$http.fetchData({
					url:'/front/user/bake/shopMgr/getLatelyShop',
					method: 'GET',
					data: {
						lat: this.lat,
						lng: this.lng
					},
					success: res => {
						if(res.ResultCode == 0){
							if(this.isUpdate){
								let it = null
								let jl = 0
								res.Data.forEach((item) => {
									if(item.distance){
										if(jl > 0){
											if(parseFloat(item.distance) < jl){
												jl = parseFloat(item.distance)
												it = item
											}
										}else{
											jl = parseFloat(item.distance)
											it = item
										}
									}
									
								})
								this.shops = it
								this.nowShop = it.name
								uni.setStorageSync('shop',JSON.stringify(it))
								uni.setStorageSync('shopid',it.pid)
								uni.setStorageSync('oldshopid',it.pid)
								this.getShopInfo(it.pid)
								this.getBanner()
							}
						}
					}
				})
			},
			// 跳转更多门店
			gotoShop(){
				uni.navigateTo({
					url:'/packagePages/shop/index'
				})
			},
			getShopInfo(id){
				let that = this
				that.$http.fetchData({
					url: "/front/user/bake/shopMgr/getInfo",
					method: "GET",
					data: {
						pid: id
					},
					success: res => {
						if (res.ResultCode === 0 && res.Data) {
							let info = {
								name: res.Data.name,
								phone: res.Data.concat,
								//location: res.Data.location,
								location: {
									lat:res.Data.lat,
									lng:res.Data.lng
								},
								addr: res.Data.province+res.Data.city+res.Data.district+res.Data.detail
							}
							wx.setStorageSync('shopInfo',info);
							console.log('首页中获取shopinfo')
						}else{
							//that.isUpdate = true
							//that.getLBSLocation()
						}
					}
				})
			},
			getDefaultStore(){
				let that = this
				that.$http.fetchData({
					url: "/front/user/bake/shopMgr/getDefaultStore",
					method: "GET",
					success: res => {
						if (res.ResultCode === 0) {
							//wx.setStorageSync('shopid',res.Data.shopid);
							//that.getShopInfo(res.Data.shopid)
							//that.getBanner()
						}
					}
				})
			},
			selectBanner(e){
				let that = this
				let id = that.list3[e].goodsId
				uni.navigateTo({
					url:'/packagePages/product/index?pid='+id
				})
			},
			tolist(type){
				if(type == 2){
					uni.navigateTo({
						url:'/packagePages/address/index'
					})
				}else{
					uni.navigateTo({
						url:'/packagePages/takeWay/index?type='+type
					})
				}
			},
			tolists(path){
				uni.navigateTo({
					url:path
				})
			},
			getBanner(){
				uni.showLoading({
					title: '加载中'
				});
				let that = this
				let shopid = wx.getStorageSync('shopid')
				that.$http.fetchData({
					url: '/front/user/bake/contactUs/BannerList',
					method: 'GET',
					data: {
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							let data = res.Data
							data.forEach(item=>{
								item.images=that.$http.ossUrl+item.images
							})
							
							that.list3=data
							uni.hideLoading();
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
