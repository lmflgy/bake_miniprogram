<template>
	<view class="cart-page">
		<view class="cart-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="购物车" toHome></commonNavbar>
		</view>
		<view class="cart-container u-flex u-row-between" :style="{'padding-top':statusBarHeight+44+'px'}">
			<text class="tip">商品库存有限尽快下单哦</text>
			<view class="operate" @click="handleTop">
				<text v-if="isEdit">完成</text>
				<text v-else>编辑</text>
			</view>
		</view>
		<view class="cart-main">
			<view class="cart-item u-flex u-col-center" v-for="(item,index) in list" :key="index"
				@click="toDetail(item)">
				<image src="../../static/gwc.png" mode="" class="select" @click.stop="handleSelect(item,index,1)"
					v-if="!item.isSelected"></image>
				<image src="../../static/gwc_gx.png" mode="" class="select" @click.stop="handleSelect(item,index,0)"
					v-else></image>
				<image :src="ossUrl+item.images" mode="" class="img"></image>
				<view class="info u-flex-1 u-flex-col u-row-between">
					<view class="title">
						{{item.goodsName}}
					</view>
					<text class="spec" v-if="item.specName&&item.sandwichName">{{item.specName}}/{{item.sandwichName}}</text>
					<text class="spec" v-else>单品</text>
					<view class="operate u-flex u-row-between">
						<text class="price-item">
							¥<text class="price">{{(item.price*item.num).toFixed(2)}}</text>
						</text>
						<u-number-box :min="1" :max="100" :asyncChange="true" v-model="item.num">
							<view slot="minus" class="minus" @click="updateNum(item,0)">
								<u-icon name="minus" size="18rpx"></u-icon>
							</view>
							<text slot="input" class="input">
								{{item.num}}
							</text>
							<view slot="plus" class="plus" @click="updateNum(item,1)">
								<u-icon name="plus" size="18rpx"></u-icon>
							</view>
						</u-number-box>
					</view>
				</view>
			</view>
		</view>

		<view class="cart-bottom u-flex u-col-center">
			<view class="bottom-box u-flex-1 u-flex">
				<image src="../../static/gwc.png" mode="" class="select" @click="handleSelectAll(1)" v-if="!isAll">
				</image>
				<image src="../../static/gwc_gx.png" mode="" class="select" @click="handleSelectAll(0)" v-else></image>
				<view class="bottom-tip u-flex-1 u-flex u-row-between u-col-center">
					<text class="num">全选
						<text v-if="!isEdit">(共{{buyList.length}}件)</text>
					</text>
					<view class="price-item" v-if="!isEdit">
						合计：
						<text class="price-all">
							¥<text class="price">{{totalPrice.toFixed(2)}}</text>
						</text>
					</view>
				</view>
			</view>
			<view class="buy-btn" @click="toOrder" v-if="!isEdit">付款</view>
			<view class="buy-btn" @click="handleDelete" v-else>删除</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				list: [],
				isEdit: false,
				number: 1,
				buyList: [],
				isAll: false,
				totalPrice: 0,
				ossUrl: '',
				size: [],
				sand: [],
				date: '',
				status: 0,
				temp: [],
				today: ''
			};
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		onShow() {
			this.totalPrice = 0
			this.getList()
		},
		onShareAppMessage() {
			const promise = new Promise(resolve => {
				let userid = wx.getStorageSync('userid')
				if (userid) {
					let that = this
					that.$http.fetchData({
						url: '/front/userMgr/getInfo',
						method: 'GET',
						data: {
							userid: userid
						},
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
		mounted() {
			let token = uni.getStorageSync('token')
			if (!token) {
				uni.showToast({
					title: '请先登录！',
					icon: 'none'
				});
				setTimeout(function() {
					uni.navigateTo({
						url: '/packageUser/login/login'
					})
				}, 1500)
			}
			this.ossUrl = this.$http.ossUrl
			this.loadSize()
			this.loadSand()
		},
		methods: {
			loadSize() {
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
			loadSand() {
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
								that.temp = res.Data[0].goodsIdList
							}
						}
					}
				})
			},
			toOrder() {
				if (this.buyList.length == 0) {
					uni.showToast({
						title: '请选择至少一个商品！',
						duration: 2000,
						icon: 'none'
					});
					return
				}
				// 判断规格是否售罄
				if (this.size != null && this.size.length > 0) {
					let tips = ''
					this.buyList.forEach((id) => {
						let item = this.list.find(d => d.pid == id)
						if (item) {
							let it = this.size.find(d => d.name == item.specName)
							if (it) {
								if (it.status == 1) {
									tips += item.goodsName + it.name + '今日已售罄；'
								}
							}
						}
					})
					if (tips) {
						uni.showModal({
							title: '提示',
							content: tips,
							showCancel: false,
							confirmText: '我知道了'
						})
						return
					}
				}
				// 判断夹心是否售罄
				if (this.sand != null && this.sand.length > 0) {
					let tips = ''
					this.buyList.forEach((id) => {
						let item = this.list.find(d => d.pid == id)
						if (item) {
							let it = this.sand.find(d => d.sandwichId == item.sandwichId)
							if (it) {
								if (it.status == 1) {
									tips += item.goodsName + it.sandwichName + '今日已售罄；'
								}
							}
						}
					})
					if (tips) {
						uni.showModal({
							title: '提示',
							content: tips,
							showCancel: false,
							confirmText: '我知道了'
						})
						return
					}
				}
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/orderFromCart',
					method: 'POST',
					header: { 'content-type': "application/json" },
					data: {
						carIds: that.buyList
					},
					success: res => {
						if (res.ResultCode === 0) {
							wx.setStorageSync('cartDataItems', that.buyList)
							wx.setStorageSync('orderData', res.Data)
							that.totalPrice = 0
							uni.navigateTo({
								url: '/packagePages/order/settlement?type=0'
							})
						}
					}
				})
			},
			handleDelete() {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/BatchDeleteCar',
					method: 'POST',
					header: {
						'content-type': "application/json"
					},
					data: {
						ids: that.buyList
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.totalPrice = 0
							that.getList()
							that.updateTotalPrice()
						}
					}
				})
			},
			updateTotalPrice() {
				this.totalPrice = 0
				let total = 0
				this.list.forEach(item => {
					if (item.isSelected) {
						total += item.price * item.num
					}
				})
				this.totalPrice = total
			},
			updateNum(item, type) {
				let that = this
				if (type) {
					item.num++
				} else {
					if (item.num == 1) return
					item.num--
				}
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/editShoppingCart',
					method: 'POST',
					data: {
						carId: item.pid,
						num: item.num
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.updateTotalPrice()
						}
					}
				})
			},
			getList() {
				let that = this
				that.buyList = []
				that.isAll = false
				that.isEdit = false
				let shopid = wx.getStorageSync('shopid')
				let userid = wx.getStorageSync('userid')
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/shoppingCartList',
					method: 'POST',
					data: {
						shopId: shopid,
						userId: userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							res.Data.forEach(item => {
								var tp = item.images.split(',')
								item.images = tp[0]
								item.isSelected = false
							})
							that.list = res.Data
							that.totalPrice = 0
						}
					}
				})
			},
			handleTop() {
				this.isEdit = !this.isEdit
				this.isAll = false
				this.list.forEach(item => {
					item.isSelected = false
				})
				this.buyList = []
				this.totalPrice = 0
			},
			handleSelect(item, index, type) {
				item.isSelected = !item.isSelected
				if (type) {
					this.buyList.push(item.pid)
				} else {
					let i = this.buyList.indexOf(item.pid)
					this.buyList.splice(i, 1)
				}
				if (this.buyList.length == this.list.length) {
					this.isAll = true
				} else {
					this.isAll = false
				}
				this.updateTotalPrice()
			},
			handleSelectAll(type) {
				this.isAll = !this.isAll
				this.buyList = []
				this.list.forEach(item => {
					if (type) {
						item.isSelected = true
						this.buyList.push(item.pid)
					} else {
						item.isSelected = false
						this.buyList = []
					}
				})
				this.updateTotalPrice()
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/packagePages/product/index?pid=' + item.goodsId
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>