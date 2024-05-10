<template>
	<view class="menu-page">
		<view class="menu-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar inputShow="true" :fixed="false" @keyword="handleKeyWord" toHome></commonNavbar>
		</view>
		<view class="menu-main" :style="{'padding-top':statusBarHeight+44+'px'}">
			<productList :extra="statusBarHeight+44" :keyword="keyword" :isload="isload" :current="0"></productList>
		</view>
	</view>
</template>

<script>
	import productList from "@/components/productList.vue"
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		components: {productList},
		data() {
			return {
				cateList: [],
				keyword: '',
				isload: ''
			};
		},
		computed:{
			...mapGetters(['statusBarHeight','isLogin'])
		},
		mounted() {
			
		},
		onShow(){
			let shopid = uni.getStorageSync('shopid')
			if(shopid){
				this.isload = shopid
			}else{
				uni.navigateTo({
					url:'/packagePages/shop/index'
				})
			}
			this.isload = Math.random()
		},
		watch:{
			
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
			handleKeyWord(value){
				this.keyword=value
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>