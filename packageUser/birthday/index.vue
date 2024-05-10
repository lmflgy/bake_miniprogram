<template>
	<view class="wrap">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="生日提醒"></commonNavbar>
		</view>
		<template v-if="list != null && list.length > 0">
		<view class="item" v-for="(item,i) in list" :key="i" @click="goDetail(item.pid)">
		    <view class="dot" v-if="item.top==1"></view>
		    <image class="headimg" src="../../static/birthday-item.png" />
		    <view class="detail">
		        <view class="hd">
		            <view class="time">
		                <text>生日{{item.birthday}}</text>
		                <text v-if="item.remindermethod==2&&item.lunarcalendar"> 农历{{item.lunarcalendar}}</text>
		            </view>
		        </view>
		        <view class="bd">
		            <text class="rel" v-if="item.relationship">{{item.relationship}}</text>
		        </view>
		        <view class="bd" v-if="item.message">{{item.message}}</view>
		    </view>
		    <view class="icon-wrap">
		        <image class="icon" src="../../static/arrow-right-mini.png" />
		    </view>
		</view>
		</template>
		<image class="global__add" src="../../static/add.png" @click="goAdd" />
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				list: [],
				userid: ''
			}
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onShow() {
			this.userid = uni.getStorageSync('userid')
			this.loadInit()
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
			loadInit(){
				let that = this
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url: '/front/merchant/bake/birthdayReminder/BirthdayReminders',
					method: 'GET',
					success: res => {
						if (res.ResultCode === 0) {
							that.list = res.Data.Items
						}
					}
				})
			},
			goAdd(){
				uni.navigateTo({
					url:'edit'
				})
			},
			goDetail(pid){
				uni.navigateTo({
					url:'edit?pid='+pid
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
	    width: 100%;
	    display: flex;
	    padding: 38rpx 25rpx;
	    border-bottom: solid 1px #f5f5f5;
	    background-color: #fff;
	    position: relative;
	
	    .dot{
	        width: 16rpx;
	        height: 16rpx;
	        position: absolute;
	        top: 50%;
	        margin-top: -8rpx;
	        right: 54rpx;
	        display: block;
	        border-radius: 50%;
	        background-color: #f00;
	    }
	
	    .headimg{
	        width: 74rpx;
	        height: 74rpx;
	        display: block;
	    }
	
	    .detail {
	        flex: 1;
	        margin-left: 20rpx;
	        display: flex;
	        flex-direction: column;
	        justify-content: space-between;
	
	        .hd {
	            width: 100%;
	            display: flex;
	            align-items: center;
	            font-size: 30rpx;
	
	            .time {
	                font-size: 26rpx;
	                color: #666;
	            }
	        }
	
	        .bd {
	            width: 100%;
	            display: flex;
	            align-items: center;
	            font-size: 26rpx;
	            color: #666;
	        }
	    }
	    .tixing{
	        display: flex;
	        align-items: center;
	        padding: 0 10rpx;
	    }
	    .icon-wrap{
	        display: flex;
	        align-items: center;
	        margin-left: 20rpx;
	        .icon{
	            width: 14rpx;
	            height: 24rpx;
	            display: block;
	        }
	    }
	}
	

	.global__add {
	    position: fixed;
	    right: 20rpx;
	    bottom: 200rpx;
	    width: 94rpx;
	    height: 94rpx;
	    display: block;
	    z-index: 9;
	}
	.page-top{
		background-color: #fff;
		width: 100%;
		display: block;
	}
</style>