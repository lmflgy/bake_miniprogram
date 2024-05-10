<template>
	<view></view>
</template>
<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(param) {
			if(param.code){
				var code = param.code
				console.log(code)
				let userid = wx.getStorageSync('userid')
				if(userid){
					this.bindCode(code,userid)
				}else{
					wx.setStorageSync('sharecode',code)
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			}else{
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
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
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
