<template>
	<view>
	<view class="addr-page">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="收货地址"></commonNavbar>
		</view>
		<view :style="{'height':statusBarHeight+44+'px'}"></view>
		<view class="addr-main" v-if="list.length">
			<view class="addr-item" v-for="(item,index) in list" :key="index" @click="toList(item)">
				<image src="../../static/product/delete.png"  class="del" @click.stop="del(item.pid)"></image>
				<view class="item-top u-flex u-flex-wrap">
					<text class="tag" v-if="item.isDefault">默认</text>
					<text class="tag" v-if="item.label">{{item.label}}</text>
					<text class="title u-flex-1">{{item.province}}{{item.city}}{{item.district}}{{item.detail}}{{item.houseNumber}}</text>
				</view>
				<view class="item-bottom u-flex u-row-between">
					<text class="info">{{item.name+' '}} {{item.gender+'士'+' '}} {{item.phone}}</text>
					<image src="../../static/edit.png" mode="" class="icon" @click.stop="openAddr(1,item)"></image>
				</view>
			</view>
			
		</view>
		<view class="empty" v-else>
			<image src="../../static/empty-addr.png" mode="" class="empty-icon"></image>
			<view class="empty-text">
				您还没有收货地址哦～
			</view>
		</view>
		<view class="list-bottom u-flex u-row-center" @click="openAddr(0)">
			<view class="btn">
				+ 新建收货地址
			</view>
		</view>
	
	</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				list: [],
				backRoute: '',
				route: '',
				privacyContractName: '《微信隐私保护引导》',
				showPrivacy: false
			};
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onLoad() {
			let routes = getCurrentPages();
			this.backRoute = routes[routes.length-2].route
			this.route = routes[routes.length-2].$page.fullPath
			// console.log('路由',this.backRoute)
			// console.log('路由',routes)
			// console.log('路由',this.route)
		},
		onShow() {
			let userid = wx.getStorageSync('userid')
			this.getList(userid)
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
			
			del(id){
				let that = this
				uni.showModal({
					title:'提示',
					content:'确定删除地址吗？',
					success(flag) {
						if(flag.confirm){
							that.$http.fetchData({
								url: '/front/user/bake/shippingAddressMgr/remove',
								method: 'GET',
								data: {
									pid: id
								},
								success: res => {
									if (res.ResultCode === 0) {
										uni.showToast({
											title: '删除成功'
										})
										let userid = wx.getStorageSync('userid')
										that.getList(userid)
									}
								}
							})
						}
					}
				})
			},
			getList(id){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/shippingAddressMgr/getUserAddress',
					method: 'POST',
					data: {
						userId: id
					},
					success: res => {
						if (res.ResultCode === 0) {
							this.list=res.Data.Items
							this.list.forEach(item=>{
								if(item.isDefault==1){
									wx.setStorageSync('defaultAddr',item)
								}
							})
						}
					}
				})
			},
			openAddr(type,item){
				if(type){
					uni.navigateTo({
						url:'/packagePages/address/editAddress?addr='+JSON.stringify(item)
					})
				}else{
					uni.navigateTo({
						url:'/packagePages/address/editAddress'
					})
				}
			},
			toList(item){
				wx.setStorageSync('defaultAddr',item)
				if(this.backRoute == 'packageUser/order/orderDetail'){
					wx.setStorageSync('addrchange',true)
					uni.redirectTo({
						url:this.route
					})
				}else if (this.backRoute == 'pages/index/index'){
					uni.navigateTo({
						url:'/packagePages/takeWay/index?type=1'
					})
				}else if (this.backRoute == 'packageUser/order/orderPage'){
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.navigateTo({
						url:'/'+this.backRoute+'?type=1'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>