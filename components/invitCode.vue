<template>
	<view class="pop-wrap" :class="isShow?'active':''">
		<view class="pop-dialog">
			<text class="title">-绑定邀请-</text>
			<view class="input">
				<text>请输入</text>
				<input class="input-box" maxlength="10" v-model="code" @confirm="submit" />
			</view>
			<view class="btns">
				<view class="btn cancle" @click="cancle">取消</view>
				<view class="btn" @click="submit">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "invitCode",
		props: {
			isShow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				code: '',
				user: null
			}
		},
		watch: {
			isShow(newVal, oldVal) {
				this.loadInit()
			}
		},

		methods: {
			loadInit() {
				let userid = uni.getStorageSync('userid')
				if (userid) {
					this.$http.fetchData({
						url: '/front/userMgr/getInfo',
						method: 'GET',
						data: {
							userid: userid
						},
						success: res => {
							this.user = res.Data
							if (this.user != null) {
								this.code = this.user.invitationCode
							}
						}
					})
				}
			},
			cancle() {
				this.$emit('cancle', true)
			},
			submit() {
				if (uni.$u.test.isEmpty(this.code)) {
					uni.showToast({
						title: '请输入邀请码',
						icon: 'none'
					})
					return
				}
				this.$http.fetchData({
					url: '/front/userMgr/update',
					data: {
						pid: this.user.pid,
						invitationCode: this.code,
						nickname: this.user.nickname,
						photoUpload: this.user.photoUpload
					},
					success: res => {
						if (res.ResultCode == 0) {
							uni.showToast({
								title: '绑定成功'
							})
							uni.$u.sleep(1500).then(() => {
								this.$emit('submit', true)
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop-wrap {
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

		.pop-dialog {
			width: 600rpx;
			height: 440rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			border-radius: 8rpx;

			.title {
				font-size: 30rpx;
				font-weight: 700;
				margin-top: 20rpx;
			}

			.input {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 84rpx 0 110rpx 0;
				font-size: 26rpx;

				&-box {
					width: 350rpx;
					height: 50rpx;
					display: block;
					margin-left: 20rpx;
					border-radius: 8rpx;
					border: solid 1px #999;
					line-height: 50rpx;
					padding: 0 30rpx;
				}
			}

			.btns {
				display: flex;
			}

			.btn {
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

			.btn.cancle {
				background-color: #BFBFBF;
			}

			.btn+.btn {
				margin-left: 32rpx;
			}
		}
	}

	.pop-wrap.active {
		opacity: 1;
		visibility: visible;
	}
</style>