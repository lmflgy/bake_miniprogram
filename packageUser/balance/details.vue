<template>
	<view class="wrap">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="余额明细"></commonNavbar>
		</view>
		<view class="line"></view>
		<template v-if="list!=null&&list.length>0">
		<view class="item" v-for="(item,i) in list" :key="i">
			<view class="lt">
				<view class="title">{{item.content}}</view>
				<view class="time">{{item.date}}</view>
			</view>
			<view class="rt">
				<text v-if="item.type==1">+</text>
				<text>{{item.price}}</text>
			</view>
		</view>
		</template>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				list: []
			}
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onShow() {
			this.getBalance()
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
			getBalance(){
				let that = this
				that.$http.fetchData({
					url:'/front/user/bake/vip_serverMgr/getBalanceDetail',
					method: 'GET',
					success: res => {
						console.log(res);
						if(res.ResultCode == 0){
							that.list = res.Data
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.line{
		width: 100%;
		height: 20rpx;
		display: block;
	}
	.item{
		width: 100%;
		height: 135rpx;
		display: flex;
		padding: 28rpx 25rpx;
		.lt{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title{
				font-size: 30rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.time{
				font-size: 26rpx;
				color: #666;
			}
		}
		.rt{
			display: flex;
			align-items: center;
			font-size: 34rpx;
			font-weight: 700;
		}
	}
	.page-top{
		background-color: #fff;
		width: 100%;
		display: block;
	}
</style>