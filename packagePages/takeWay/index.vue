<template>
	<view class="take-way">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar inputShow="true" @keyword="handleKeyWord"></commonNavbar>
		</view>
		<view class="switch" :style="{'top':statusBarHeight+44+'px'}" v-show="tabIndex !=4">
			<switchTake @handleSwitch="handleSwitch($event)" :tabIndex="tabIndex" class="switch-part"></switchTake>
		</view>
		
		<!-- <view class="page-container u-flex u-row-between u-col-center" :style="{'top':statusBarHeight+44+'px'}">
			<view class="location-item" v-if="tabIndex==0">
				<view class="location other">
					国际人才创新园店 
				</view>
				<text class="sub-tip">距离您 1.2km</text>
			</view>
			<view class="location-item" v-else>
				<view class="location u-flex u-col-center">
					<text class="other">华滋可欣.设计创意园(祥茂路166(祥茂路166</text>
					>
				</view>
				<text class="sub-tip">张女士 18337252536</text>
			</view>
			<view class="switch-item u-flex">
				<view class="u-flex-1" v-for="(item,index) in ways" :key="index" @click="handleSwitch(index)" :class="index==tabIndex?'current':'tab'">{{item}}</view>
			</view>
		</view> -->
		<view class="page-main" :style="{'padding-top':statusBarHeight+44+sHeight+'px'}">
			<productList :extra="statusBarHeight+44+51" :keyword="keyword" :takeType="tabIndex" :isload="isload"></productList>
		</view>
		<view class="page-bottom u-flex">
			<view class="icon-cart" @click="showCart=!showCart">
				<image src="../../static/product/cart-fill.png" mode="aspectFill" class="img"></image>
				<u-badge bgColor="#999" max="99" :value="cartNum" absolute :offset="[-1, -1]"></u-badge>
			
			</view>
			<view class="bottom-tip u-flex-1">
				<view class="price-item">
					¥<text class="price">{{totalPrice.toFixed(2)}}</text>
				</view>
				<view class="delivery">
					<text>免配送</text>
				</view>
			</view>
			<view class="bottom-btn" @click="toOrder">
				付款
			</view>
		</view>
		
		<u-popup :show="showCart" :round="10" mode="bottom" @close="close" @open="open" :safeAreaInsetBottom="false">
			<view class="pop-head u-flex u-row-between">
				<text class="title">已选商品</text>
				<view class="u-flex u-col-center" @click="handleDelete">
					<image src="../../static/product/delete.png" mode="" class="delete-icon"></image>
					<text class="delete">清空</text>
				</view>
			</view>
			<view class="pop-main">
				<view class="item u-flex u-col-center" v-for="(item,index) in cartList" :key="index" @click="toDetail(item)">
					<image :src="ossUrl+item.images" mode="" class="img"></image>
					<view class="info u-flex-1 u-flex-col u-row-between">
						<view class="title">
							{{item.goodsName}}
						</view>
						<text class="spec" v-if="item.specName && item.sandwichName">{{item.specName}}/{{item.sandwichName}}</text>
						<text class="spec" v-else></text>
						<view class="operate u-flex u-row-between">
							<text class="price-item">
								¥<text class="price">{{item.price*item.num}}</text>
							</text>
							<u-number-box :min="1" :max="100" :asyncChange="true"
								v-model="item.num"
								>
								<!-- <image src="../../static/product/minus.png" mode="" slot="minus" class="minus"></image>
								<image src="../../static/product/plus.png" mode="" slot="plus" class="plus"></image> -->
								<view slot="minus" class="minus u-flex u-col-center u-row-center" @click="updateNum(item,0)">
								  <u-icon name="minus" size="24rpx" color="#ccc"></u-icon>
								</view>
								<text slot="input" class="input">
								 {{item.num}}
								</text>
								<view slot="plus" class="plus u-flex u-col-center u-row-center" @click="updateNum(item,1)">
								  <u-icon name="plus" size="24rpx" color="#fff"></u-icon>
								</view>
							</u-number-box>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import switchTake from '@/components/switchTake.vue'
	import productList from "@/components/productList.vue"
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		components: {productList, switchTake},
		data() {
			return {
				// takeway: 0,
				// ways: ['自提','外卖'],
				tabIndex: 0,//4堂食
				cartNum: 0,
				showCart: false,
				number: 1,
				cartList: [],
				totalPrice: 0,
				keyword: '',
				ossUrl:'',
				sHeight: 0,
				shop: null,
				isload: ''
			};
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onLoad: function (option) { 
			this.tabIndex=option.type
			this.ossUrl=this.$http.ossUrl
		},
		onShow() {
			this.isload = Math.random()
			let shop = uni.getStorageSync('shop')
			if(shop){
				this.shop = JSON.parse(shop)
			}
			this.getList()
		},
		mounted() {
			let query = wx.createSelectorQuery()
			query.select('.switch').boundingClientRect(rect=>{
			  this.sHeight = rect.height;
			}).exec();
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
			toDetail(item){
				uni.navigateTo({
					url:'/packagePages/product/index?pid='+item.goodsId+'&type='+this.tabIndex
				})
			},
			handleKeyWord(value){
				this.keyword=value
			},
			toOrder(){
				debugger
				this.showCart=false
				if(this.cartList.length==0){
					uni.showToast({
						title: '购物车暂无商品',
						icon: 'none'
					})
					return
				}
				let cartList = []
				this.cartList.forEach((item) => {
					item.sandWichId = item.sandwichId
					cartList.push(item)
				})
				if(this.tabIndex == 4){
					uni.navigateTo({
						url: '/packagePages/order/tangShi?type='+this.tabIndex
					})
				}else{
					uni.navigateTo({
						url: '/packagePages/order/settlement?type='+this.tabIndex
					})
				}
				
				wx.setStorageSync('orderData',cartList)
			},
			updateTotalPrice(){
				this.totalPrice=0
				this.cartList.forEach(item=>{
					this.totalPrice+=(item.price*item.num)
				})
			},
			handleDelete(){
				let that = this
				let list = []
				that.cartList.forEach(item=>{
					list.push(item.pid)
				})
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/BatchDeleteCar',
					method: 'POST',
					header: {
						'content-type': "application/json"
					},
					data: {
						ids: list
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
								title: '删除成功',
								icon: "success"
							})
							that.cartList=[]
							that.cartNum=0
							that.totalPrice = 0
						}
					}
				})
			},
			open() {
			  // console.log('open');
			},
			close() {
			  this.showCart = false
			  // console.log('close');
			},
			handleSwitch(index){
				this.tabIndex = index
			},
			updateNum(item,type){
				let that = this
				if(type){
					item.num+=1
				}else{
					if(item.num==1) return
					item.num-=1
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
			getList(){
				let that = this
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
							that.cartList=res.Data
							that.cartNum=res.Data.length
							this.updateTotalPrice()
						}
					}
				})
			},
			
		}
	}
</script>
<style lang="scss" scoped>
	@import './index.scss';
</style>