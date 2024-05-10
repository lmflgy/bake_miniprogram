<template>
	<view class="order-list">
		<view class="list-box">
			<view class="list-item u-flex" v-for="(item,index) in list" :key="index">
				<image :src="ossUrl+item.images" mode="aspectFill" class="item-img"></image>
				<view class="item-info u-flex-1">
					<view class="info-title u-flex u-row-between">
						<text class="title">{{item.goodsName}}</text>
						<text class="price">¥{{item.price}}</text>
					</view>
					<view class="info-spec u-flex u-row-between">
						<view class="spec" v-if="item.specName || item.goodsSpec">
							{{item.specName || item.goodsSpec}}/{{item.sandwichName || item.goodsSandwich}}
						</view>
						<view class="spec" v-else></view>
						<text class="num">x{{item.num}}</text>
					</view>
				</view>
			</view>
		</view>
		<slot>
			<view class="order-total">
				<text class="tip">共{{list.length}}件&nbsp;&nbsp;商品小计:</text>
				<text class="price-item">¥<text class="price">{{total.toFixed(2)}}</text></text>
			</view>
		</slot>
	</view>
</template>

<script>
	Component({
		options: {
			multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
		}
	})
	export default {
		name: "orderList",
		props: ['list'],
		data() {
			return {
				total: 0,
				ossUrl: ''
			};
		},
		watch: {
			list(newVal, oldVal) {
				if (newVal) {
					this.list.forEach(item => {
						this.total += (item.price * item.num)
					})
				}
			}
		},
		mounted() {
			this.ossUrl = this.$http.ossUrl
			// this.list.forEach(item=>{
			// 	this.total+=item.totalPrice
			// })
			// console.log(111,this.total)
		}
	}
</script>

<style lang="scss" scoped>
	.list-item {
		margin-bottom: 37rpx;

		.item-img {
			width: 160rpx;
			height: 160rpx;
			border-radius: 12rpx;
			margin-right: 27rpx;
		}

		.item-info {
			height: 160rpx;
		}

		.info-title {
			padding-bottom: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;

			.title {
				font-size: 28rpx;
			}

			.price {
				font-size: 32rpx;
			}
		}

		.info-spec {
			font-family: PingFang SC;
			color: #999999;
			width: 100%;

			.spec {
				font-size: 26rpx;
				flex-shrink: 1;
				word-break: break-all;
			}

			.num {
				font-size: 30rpx;
				font-weight: bold;
				color: #ACACAC;
			}
		}
	}

	.order-total {
		width: 100%;
		text-align: right;
		height: 98rpx;
		line-height: 98rpx;
		font-family: PingFang SC;
		font-weight: bold;
		border-top: 1rpx solid #F6F6F6;

		.tip {
			font-size: 26rpx;
			color: #333333;
		}

		.price-item {
			color: #000;
			font-size: 30rpx;
			padding-left: 10rpx;

			.price {
				font-size: 38rpx;
			}
		}
	}
</style>