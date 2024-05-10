<template>
	<view>
		<!-- <uni-nav-bar left-icon="left" :color="color" :border="false" @clickLeft="back" leftWidth="500rpx" :fixed="fixed" :backgroundColor="bgColor">
			<block slot="left" class="u-flex">
				<uni-icons type="left" size="20"/>
				<view class="left-text" v-if="!inputShow">
					{{leftText}}
				</view>
				<input type="text" class="nav-bar-input" value="搜索">
				<u--input
					class="nav-bar-input"
					type="text"
					placeholder="搜索商品"
					prefixIcon="search"
					prefixIconStyle="font-size: 36rpx;color: #999999;"
					color="#999"
					fontSize="28rpx"
					shape="circle"
					border="none"
					:customStyle="{'background-color': '#F8F8F8','width': '460rpx' ,'height': '68rpx','padding-left': '34rpx'}"
					@confirm="confirm"
					v-else>
				</u--input>
			</block>
		</uni-nav-bar> -->
	</view>
</template>

<script>
	export default {
		name:"navbar",
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
			bgColor:{
				type: String,
				default: '#fff'
			}
		},
		data() {
			return {
				input:'搜索'
			};
		},
		mounted() {
			console.log(this.input)
			let a = encodeURI(this.input)
			console.log(a)
			this.input = decodeURI(a)
			console.log("开发这工具")
		},
		methods:{
			back(){
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>
.left-text{
	font-size: 32rpx !important;
	font-family: PingFang SC;
	color: #333333;
	display: inline-block;
	overflow: visible;
}
.nav-bar-input{
	display: inline-block;
	font-size: 28rpx;
	font-family: PingFang SC;
	color: #999999;
	height: 68rpx;
	background-color: #F8F8F8;
	border-radius: 34rpx;
}
</style>