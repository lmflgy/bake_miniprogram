<template>
	<view class="contact" :style="{'padding-top':statusBarHeight+'px'}">
		<commonNavbar leftText="联系我们"></commonNavbar>
		<view class="contact-page">
			<view class="contact-img u-flex u-col-center u-row-center">
				<image :src="img" mode="" class="img1" show-menu-by-longpress="true"></image>
				<!-- <image src="../../static/contact-code.png" mode="" class="img1" show-menu-by-longpress="true"></image> -->
			</view>
			<view class="tip">
				长按识别 联系我们
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		data (){
			return {
				img: ''
			}
		},
		computed: {
			...mapGetters(['statusBarHeight', 'screenHeight'])
		},
		onLoad() {
			this.getInfo()
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
			getInfo(){
				let that = this
				let shopid = wx.getStorageSync('shopid')
				that.$http.fetchData({
					url: '/front/user/bake/contactUs/contactUs',
					method: 'GET',
					data: {
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.img = that.$http.ossUrl+res.ResultInfo
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