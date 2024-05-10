<template>
	<view>
		<uni-nav-bar left-icon="left" :color="color" :border="false" leftWidth="500rpx" :fixed="fixed"
			:backgroundColor="bgColor">
			<block slot="left" class="u-flex">
				<uni-icons type="left" size="20" @tap="back" v-if="isBack" />
				<view class="left-text" v-if="!inputShow" :style="{'font-weight':bold}">
					{{leftText}}
				</view>
				<u--input class="nav-bar-input" type="text" v-model="keyword" placeholder="搜索商品" prefixIcon="search"
					prefixIconStyle="font-size: 36rpx;color: #999999;" color="#999" fontSize="28rpx" shape="circle"
					border="none"
					:customStyle="{'background-color': '#F8F8F8','width': '460rpx' ,'height': '68rpx','padding-left': '34rpx'}"
					@blur="search" v-else>
				</u--input>
			</block>
		</uni-nav-bar>
	</view>
</template>

<script>
	export default {
		name: "commonNavbar",
		props: {
			leftText: String,
			inputShow: {
				type: [Boolean, String],
				default: false
			},
			color: {
				type: String,
				default: 'black'
			},
			fixed: {
				type: Boolean,
				default: true
			},
			isBack: {
				type: Boolean,
				default: true
			},
			bgColor: {
				type: String,
				default: '#fff'
			},
			toHome: {
				type: Boolean,
				default: false
			},
			custome: {
				type: Boolean,
				default: false
			},
			bold:{
				type: String,
				default: 'bold'
			}
		},
		data() {
			return {
				keyword: ''
			};
		},
		methods: {
			back() {
				let that = this
				if (that.custome) {
					that.$emit('backTo', true)
				} else {
					if (that.toHome) {
						uni.switchTab({
							url: '/pages/index/index'
						});
					} else {
						uni.navigateBack()
					}
				}
			},
			search() {
				this.$emit('keyword', this.keyword)
			}
		}
	}
</script>


<style lang="scss" scoped>
	.left-text {
		font-size: 32rpx !important;
		font-family: PingFang SC;
		color: #333333;
		display: inline-block;
		overflow: visible;
	}

	.nav-bar-input {
		// display: inline-block;
		// font-size: 28rpx;
		// font-family: PingFang SC;
		// color: #999999;
		// height: 68rpx;
		// background-color: #F8F8F8;
		// border-radius: 34rpx;
	}
</style>