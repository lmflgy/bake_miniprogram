<template>
	<view class="settlement-page">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="订单结算"></commonNavbar>
		</view>
		<view :style="{'height':statusBarHeight+44+'px'}"></view>
		<view class="settlement-info">
			<switchTake @handleSwitch="handleSwitch($event)" order :isWuliu="isWuliu" :tabIndex="switchTab" @init="handleSwitchInit">
			</switchTake>
			<view class="info-box" v-if="switchTab == 2">
				<u-cell-group :border="false">
					<u-cell :border="false">
						<view class="cell-name" slot="title">姓名</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="ad.name" class="nameInput" placeholder="请输入">
						</view>
					</u-cell>
					<u-cell :border="false">
						<view class="cell-name" slot="title">联系电话</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="ad.phone" class="nameInput" placeholder="请输入">
						</view>
					</u-cell>
					<picker mode="region" @change="handleRegion">
						<u-cell :border="false" :isLink="true" arrow-direction="right">
							<view class="cell-name" slot="title">所在地区</view>
							<view class="cell-value" slot="value">
								<input type="text" v-model="ad.regionTips" class="nameInput" placeholder="请选择" disabled>
							</view>
						</u-cell>
					</picker>
					<u-cell :border="false">
						<view class="cell-name" slot="title">详细地址</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="ad.detail" class="nameInput" placeholder="请输入您的详细地址">
						</view>
					</u-cell>
				</u-cell-group>
			</view>
			<view class="info-box" v-else>
				<u-cell-group :border="false">
					<u-cell :border="false" v-if="!switchTab">
						<view class="cell-name" slot="title">姓名</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="username" class="nameInput" placeholder="请输入">
						</view>
					</u-cell>
					<u-cell :border="false" v-if="!switchTab">
						<view class="cell-name" slot="title">联系电话</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="phone" class="nameInput" placeholder="请输入">
						</view>
					</u-cell>
					<u-cell :border="false" :isLink="true" arrow-direction="right" v-if="!switchTab">
						<view class="cell-name" slot="title">取货时间</view>
						<view class="cell-value" slot="value" @click="timeShow=true">
							<input type="text" v-model="takeTime" class="nameInput" placeholder="请选择" disabled>
						</view>
					</u-cell>
					<u-cell :border="false" :isLink="true" arrow-direction="right" v-if="switchTab">
						<view class="cell-name" slot="title">预计送达时间</view>
						<view class="cell-value" slot="value" @click="timeShow=true">
							<input type="text" v-model="takeTime" class="nameInput" placeholder="请选择" disabled>
						</view>
					</u-cell>
					<u-cell :border="false" :isLink="true" arrow-direction="right" v-if="isMore">
						<view class="cell-name" slot="title">餐具选择</view>
						<view class="cell-value" slot="value" @click="isTableware=true">
							<input type="text" v-model="tableware" class="nameInput" placeholder="请选择" disabled>
						</view>
					</u-cell>
					<u-cell :border="false">
						<view class="cell-name" slot="title">贺卡内容</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="greetingCard" class="nameInput" placeholder="请输入贺卡内容">
						</view>
					</u-cell>
					<u-cell :border="false">
						<view class="cell-name" slot="title">买家备注</view>
						<view class="cell-value" slot="value">
							<input type="text" v-model="remark" class="nameInput" placeholder="请输入您需要留言的内容">
						</view>
					</u-cell>
					<view class="photo-wrap">
						<view class="cell-name">图片上传</view>
						<view class="photo" @tap="choosePhoto">
							<template v-if="imgUrl != null && imgUrl.length > 0">
								<view class="pt" v-for="(src,i) in imgUrl" :key="i">
									<view class="co" @tap.stop="delImg(i)">
										<image class="cl" src="../../static/product/delete.png"></image>
									</view>
									<image class="pp" :src="src"></image>
								</view>
							</template>
							<view class="pt" v-if="imgUrl.length < 9">
								<image class="add" src="../../static/caream.png"></image>
							</view>
						</view>
					</view>
				</u-cell-group>
			</view>
		</view>
		<view class="settlement-product">
			<orderList :list="productList"></orderList>
		</view>
		<view class="settlement-totals">
			<view class="st">
				<text>商品价格</text>
				<text class="rt">￥{{totalPrice.toFixed(2)}}</text>
			</view>
			<view class="st">
				<text>剩余余额</text>
				<text class="rt" v-if="balance>0">￥{{balance.toFixed(2)}}</text>
				<text class="rt" v-else>￥0</text>
			</view>
			<view class="st" v-if="balance > 0">
				<text>余额支付</text>
				<text class="rt" v-if="balance>=totalPrice">-￥{{totalPrice.toFixed(2)}}</text>
				<text class="rt" v-else>-￥{{balance.toFixed(2)}}</text>
			</view>
			<view class="st" v-if="switchTab==1||switchTab==2">
				<text>运费</text>
				<text class="rt">￥{{sendPrice.toFixed(2)}}</text>
			</view>
			<view class="st">
				<text>实际支付</text>
				<text class="rt">￥{{sf.toFixed(2)}}</text>
			</view>
		</view>
		<view class="sl-line"></view>
		<view class="settlement-bottom u-flex u-row-between">
			<view class="total">
				<view>
					<text class="send-unit">总计:</text>
					<text class="price-item">
						<text>¥</text>
						<text class="price" v-if="sf>0">{{sf.toFixed(2)}}</text>
						<text class="price" v-else>0</text>
					</text>
				</view>
			</view>
			<view class="btn" @click="submit">提交订单</view>
		</view>

		<u-popup :show="timeShow" mode="bottom" @close="close" @open="open" :round="'24rpx'" closeable
			safeAreaInsetBottom class="take-time">
			<view class="take-time-header">{{switchTab == 1 ? '选择预计送达时间' : '选择取餐时间'}}</view>
			<view class="take-time-main u-flex">
				<scroll-view scroll-y class="left scroll">
					<view class="day-item" v-for="(item,index) in dayList" :key="index" @click="dayPick(item,index)"
						:class="dayIndex==index?'active':''">{{item}}</view>
				</scroll-view>
				<view class="right u-flex-1" v-if="dayIndex==0">
					<view class="time-item" v-for="(item,index) in nowTimeList" :key="index"
						@click="timePick(item,index)" :class="timeIndex==index?'cur':''">
						{{item}}
					</view>
				</view>
				<view class="right u-flex-1" v-else>
					<view class="time-item" v-for="(item,index) in timeList" :key="index" @click="timePick(item,index)"
						:class="timeIndex==index?'cur':''">{{item}}</view>
				</view>
			</view>
		</u-popup>
		<!--订单须知-->
		<view class="pop-wrap" :class="isKnow?'active':''">
			<view class="pop-dialog">
				<text class="title">-温馨提示-</text>
				<view class="tips">亲爱滴，请确认您的订单信息，下单后无法修改哦~</view>
				<view class="btn" @click="isKnow=false">我知道了</view>
			</view>
		</view>
		<!--温馨提示-->
		<view class="pop-wrap" :class="isCode?'active':''">
			<view class="pop-dialog">
				<text class="title">-温馨提示-</text>
				<text class="cts">查询到您还未添加客服邀请码添加后在购买</text>
				<view class="btns">
					<view class="btn cancle" @click="goCan">稍后添加</view>
					<view class="btn" @click="goAdd">立即添加</view>
				</view>
			</view>
		</view>
		<invitCode :isShow="isEdit" @cancle="codeHandle" @submit="codeHandle"></invitCode>
		<!--温馨提示打桩-->
		<view class="pop-wrap" :class="isDz?'active':''">
			<view class="pop-dialog">
				<text class="title">-温馨提示-</text>
				<text class="tipss">该蛋糕会进行打桩，请品尝时小心注意</text>
				<view class="btns">
					<view class="btn" @click="isDz=false">我知道了</view>
				</view>
			</view>
		</view>
		<!--温馨提示-->
		<view class="pop-wrap">
			<view class="pop-dialog">
				<text class="djs" v-if="ct>0">{{ct}}S</text>
				<text class="title">-免单活动-</text>
				<rich-text class="cts" :nodes="freeTips"></rich-text>
				<view class="btns" v-if="ct == 0"> 
					<view class="btn b1" @click="useFree">立即充值</view>
					<button class="btn b2" open-type="contact" @tap.stop="handleRt">咨询客服</button>
					<view class="btn b3" @click="afterFree">放弃免单</view>
				</view>
				<view class="btns" v-else>
					<view class="btn cancle">立即充值</view>
					<view class="btn cancle">咨询客服</view>
					<view class="btn cancle">放弃免单</view>
				</view>
			</view>
		</view>
		<view class="free-wrap" :class="isFree?'active':''">
			<view class="free-box">
				<view class="free-body">
					<image class="free-back" src="@/static/v2/active-back.png"></image>
					<view class="countdown" v-if="ct > 0">{{ct}}S</view>
					<view class="free-title">-免单活动-</view>
					<rich-text :nodes="freeTips" class="free-content"></rich-text>
					<view class="free-btns" v-if="ct == 0">
						<view class="free-btn free-ok" @tap="useFree">
							<image class="free-btn-back" src="@/static/v2/active-buy.png"></image>
							<text class="free-btn-text">立即充值</text>
						</view>
						<button class="free-btn free-ok" open-type="contact" @tap.stop="handleRt">
							<image class="free-btn-back" src="@/static/v2/active-contact.png"></image>
							<text class="free-btn-text">咨询客服</text>
						</button>
					</view>
					<view class="free-btns" v-else>
						<view class="free-btn">
							<image class="free-btn-back" src="@/static/v2/active-buy-disabled.png"></image>
							<text class="free-btn-text">立即充值</text>
						</view>
						<view class="free-btn">
							<image class="free-btn-back" src="@/static/v2/active-contact-disabled.png"></image>
							<text class="free-btn-text">咨询客服</text>
						</view>
					</view>
				</view>
				<view class="free-fq" @tap="afterFree" v-if="ct == 0">放弃免单直接付款</view>
				<view class="free-fq free-fq-disabled" v-else>放弃免单直接付款</view>
			</view>
		</view>
		<!--关注-->
		<view class="pop-wrap" :class="isFollow?'active':''">
			<view class="pop-dialog">
				<text class="title">-温馨提示-</text>
				<text class="tipss">关注公众号查看订单状态</text>
				<image show-menu-by-longpress class="qrcode" src="../../static/qrcode.jpg"></image>
				<text class="tipss">长按二维码关注</text>
				<view class="btns">
					<view class="btn" @click="knowFollow">我知道了</view>
				</view>
			</view>
		</view>
		<!--餐具选择-->
		<u-popup :show="isTableware" mode="bottom" @close="isTableware=false" @open="open" :round="'24rpx'" closeable
			safeAreaInsetBottom class="take-time">
			<view class="take-time-header">请选择餐具数量</view>
			<view class="tableWare" v-if="tablewareData!=null&&tablewareData.length>0">
				<view class="tableWare-item" :class="i==tablewareId?'active':''" v-for="(item,i) in tablewareData"
					:key="i" @tap="tablewareId=i">{{item}}</view>
			</view>
			<view class="tableWare-btn" @tap="confirmTableware">确定</view>
		</u-popup>
		<u-picker :show="false" :columns="[tablewareData]" @close="isTableware=false" @cancel="isTableware=false"
			@confirm="tablewareHandler" closeOnClickOverlay></u-picker>
	</view>
</template>

<script>
	import invitCode from '@/components/invitCode.vue'
	import orderList from '@/components/orderList.vue'
	import switchTake from '@/components/switchTake.vue'
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			switchTake,
			invitCode,
			orderList
		},
		data() {
			return {
				switchTab: 0,
				username: '',
				phone: '',
				takeDay: '',
				time: '',
				takeTime: '',
				deliveryTime: '',
				remark: '',
				timeShow: false,
				imgUrl: [],
				dayList: [],
				timeList: [],
				nowTimeList: [],
				dayIndex: 0,
				timeIndex: null,
				productList: [],
				totalPrice: 0,
				sendPrice: 0,
				sendNo: '',
				addr: null,
				isKnow: true,
				notice: '',
				isCode: false,
				isFree: false,
				freeTips: '',
				user: null,
				isEdit: false,
				timer: null,
				freeType: 0,
				orderType: 0,
				balance: 0,
				sf: 0,
				greetingCard: '',
				tableware: '5人份',
				tablewareId: 0,
				tablewareData: ['5人份', '10人份', '15人份', '20人份', '25人份'],
				isTableware: false,
				isFollow: false,
				holiday: [],
				isDz: false,
				isSubmit: true,
				isMore: false,
				ct: 5,
				ad: {
					name: '',
					phone: '',
					regionTips: '',
					regionData: [],
					detail: ''
				}
			}
		},
		computed: {
			...mapGetters(['statusBarHeight'])
		},
		onLoad: function(option) {
			this.switchTab = Number(option.type)
			if(this.switchTab == 0){
				this.getTime()
			}else if(this.switchTab == 1){
				this.getTime1()
			}
			this.productList = wx.getStorageSync('orderData')
			this.productList.forEach(item => {
				var tp = item.images.split(',')
				item.images = tp[0]
				this.totalPrice += (item.price * item.num)
				this.sf += (item.price * item.num)
				if(item.isMore == 0){
					this.isMore = true
				}
			})
		},
		onShow() {
			this.getBalance()
			this.loadUser()
			this.loadWxts()
			//this.loadNotice()
			this.loadData()
			if(this.switchTab == 2){
				if(this.ad != null && this.ad.regionData != null && this.ad.regionData.length > 0){
					this.handleCountWeight()
				}
			}else if(this.switchTab == 1){
				this.getSend()
				this.getTime1()
			}
			// 发起订阅
			wx.requestSubscribeMessage({
				tmplIds: ['Gvw63lGwjcEVnyLjkE6j1cTIZ52SAmlYRHFtC0-7i7s'],
				complete: () => {
					console.log(1);
				}
			})
		},
		onShareAppMessage() {
			const promise = new Promise(resolve => {
				let userid = wx.getStorageSync('userid')
				if (userid) {
					let that = this
					that.$http.fetchData({
						url: '/front/userMgr/getInfo',
						method: 'GET',
						data: {
							userid: userid
						},
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
			handleRegion(e){
				this.ad.regionData = e.detail.value
				this.ad.regionTips = this.ad.regionData[0] + ' ' + this.ad.regionData[1] + ' ' + this.ad.regionData[2]
				this.handleCountWeight()
			},
			handleRt(){
				return false
			},
			delImg(i){
				this.imgUrl.splice(i, 1)
			},
			choosePhoto(){
				console.log('choose');
				let that = this
				uni.chooseImage({
					count: 9,
					success: function (res) {
						res.tempFilePaths.forEach((src) => {
							that.$http.uploadData({
								url: "/common/uploadNew",
								method: "POST",
								filePath: src,
								success: res => {
									if (res.ResultCode === 0) {
										that.imgUrl.push(that.$http.ossUrl+res.fileName)
									}
								}
							})
						})
					}
				});
			},
			confirmTableware() {
				this.tableware = this.tablewareData[this.tablewareId]
				this.isTableware = false
			},
			loadData() {
				let shopid = wx.getStorageSync('shopid')
				let that = this
				that.$http.fetchData({
					url: '/front/merchant/server/sellEndManageList',
					method: 'GET',
					data: {
						type: 3,
						shopId: shopid
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.holiday = res.Data
						}
					}
				})
			},
			tablewareHandler(e) {
				this.tableware = e.value[0]
				this.isTableware = false
			},
			useFree() {
				// 使用免单
				this.isFree = false
				this.freeType = 1
				if (this.orderType == 1 || this.orderType == 2) {
					this.delivery()
				} else {
					this.selfPick()
				}
			},
			loadSendPrice() {
				let shopid = uni.getStorageSync('shopid')
				let that = this
				let city = that.addr.city
				if (city == '市辖区') {
					city = that.addr.province
				}
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url: '/front/user/bake/goodsMgr/getFreight',
					method: 'POST',
					data: {
						shopId: shopid,
						cityName: city,
						phone: that.addr.phone,
						address: city + that.addr.district,
						addressDetail: that.addr.detail,
						receiverName: that.addr.name,
						lat: that.addr.lat,
						lng: that.addr.lng
					},
					success: res => {
						if (res.ResultCode == 0) {
							that.sendPrice = res.Data.totalAmount / 100
							that.sendNo = res.Data.orderNumber
							that.sf = that.totalPrice
							if (that.balance >= that.totalPrice) {
								that.sf = 0
							} else {
								that.sf = that.totalPrice - that.balance
							}
							that.sf = that.sf + that.sendPrice
							if(that.sendPrice >= 30){
								that.isDz = true
							}
						} else {
							uni.showModal({
								title: '提示',
								content: res.ResultInfo,
								showCancel: false,
								confirmText: '我知道了',
								success() {}
							})
						}
					}
				})
			},
			loadUser() {
				let userid = uni.getStorageSync('userid')
				this.$http.fetchData({
					url: '/front/userMgr/getInfo',
					method: 'GET',
					data: {
						userid: userid
					},
					success: res => {
						this.user = res.Data
						if (this.user) {
							this.name = this.user.nickname
							this.phone = this.user.mobile
							if(!this.phone){
								// 提示用户绑定信息
								uni.showModal({
									title: '提示',
									content: '请先前往个人中心绑定手机号码在继续哦！',
									showCancel: false,
									confirmText: '立即绑定',
									success() {
										uni.navigateTo({
											url: '/packageUser/setting/setting?isback=9'
										})
									}
								})
							}
						}
					}
				})
			},
			loadWxts() {
				this.$http.fetchData({
					url: '/front/user/bake/goodsMgr/getOrderWarn',
					method: 'GET',
					success: res => {
						// 4倍免费.
						// 宏变量[四倍价格]跟[蛋糕价格]
						this.freeTips = res.ResultInfo.replace('[四倍价格]','￥' + this.totalPrice * 4).replace('[蛋糕价格]','￥' + this.totalPrice)
					}
				})
			},
			loadNotice() {
				this.$http.fetchData({
					url: '/front/user/bake/goodsMgr/getOrderNotice',
					method: 'GET',
					success: res => {
						this.notice = res.ResultInfo
					}
				})
			},
			knowFollow() {
				this.isFollow = false
				wx.removeStorageSync('orderData')
				uni.redirectTo({
					url: '/packageUser/order/orderPage'
				})
			},
			toPay(data) {
				let that = this
				let info = JSON.parse(data.result.payInfo)
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: info.timeStamp,
					nonceStr: info.nonceStr,
					package: info.package,
					signType: info.signType,
					paySign: info.paySign,
					success: function(res) {
						if (res.errMsg == "requestPayment:ok") {
							uni.showToast({
								title: '支付成功',
								icon: 'success',
								mask: true
							});
							setTimeout(function() {
								that.isFollow = true
							}, 1500);
						}
					},
					fail: function(err) {
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						});
						setTimeout(function() {
							uni.redirectTo({
								url: '/packageUser/order/orderPage'
							})
						}, 1500)

					}
				});

			},
			delivery() {
				if(this.isSubmit){
					this.isSubmit = false
					uni.showLoading({ title: '下单中' })
					let that = this
					let ot = that.switchTab
					let addrs = wx.getStorageSync('defaultAddr')
					this.addr = addrs
					if(this.orderType == 2){
						ot = 3
						var date = new Date()
						var y = date.getFullYear()
						var m = date.getMonth() + 1
						if(m < 10){
							m = '0' + m
						}
						var d = date.getDate()
						if(d < 10){
							d = '0' + d
						}
						this.takeTime = y + '-' + m  + '-' + d + ' 17:00-18:00'
						addrs = {
							province: this.ad.regionData[0],
							city: this.ad.regionData[1],
							district: this.ad.regionData[2],
							detail: this.ad.detail,
							name: this.ad.name,
							phone: this.ad.phone
						}
					}
					let addr = addrs.province + addrs.city + addrs.district
					addr += addrs.region || addrs.detail
					addr += addrs.houseNumber
					let shopid = wx.getStorageSync('shopid')
					let userid = wx.getStorageSync('userid')
					let carIds = wx.getStorageSync('cartDataItems')
					if (!carIds) {
						carIds = []
					}
					let img = ''
					if(this.imgUrl != null && this.imgUrl.length > 0){
						img = JSON.stringify(this.imgUrl)
					}
					that.$http.fetchData({
						url: '/front/user/bake/goodsMgr/deliveryPlaceAnOrder',
						header: {
							'content-type': "application/json"
						},
						data: {
							bakeOrderDetailParamList: that.productList,
							adress: addr,
							message: that.remark,
							name: addrs.name,
							lat: that.addr.lat,
							lng: that.addr.lng,
							orderType: ot,
							phone: addrs.phone,
							estimatedDeliveryTime: that.takeTime,
							shopId: shopid,
							userId: userid,
							totalPrice: that.totalPrice,
							sex: addrs.gender,
							shansongNo: that.sendNo,
							shansongPrice: (that.switchTab > 0 ? that.sendPrice : 0),
							freeType: that.freeType,
							carIds: carIds,
							greetingCard: that.greetingCard,
							tableware: that.tableware,
							imgUrl: img
						},
						success: res => {
							if (res.ResultCode === 0) {
								wx.removeStorageSync('cartDataItems')
								that.toPay(JSON.parse(res.ResultInfo))
							}else if(res.ResultCode ===1){
								wx.removeStorageSync('cartDataItems')
								wx.removeStorageSync('orderData')
								uni.showToast({
									title: '余额支付成功',
									icon:'success',
									mask: true
								});
								setTimeout(function() {
									that.isFollow = true
								}, 1500);
							}
						}
					})
				}
			},
			selfPick() {
				if(this.isSubmit){
					this.isSubmit = false
					// 需要判断是否可以免单
					uni.showLoading({ title: '下单中' })
					let that = this
					let shopAddr = wx.getStorageSync('shopInfo').addr
					let shopid = wx.getStorageSync('shopid')
					let userid = wx.getStorageSync('userid')
					let carIds = wx.getStorageSync('cartDataItems')
					if (!carIds) {
						carIds = []
					}
					
					let img = ''
					if(this.imgUrl != null && this.imgUrl.length > 0){
						img = JSON.stringify(this.imgUrl)
					}
					that.$http.fetchData({
						url: '/front/user/bake/goodsMgr/selfPickUpOrder',
						header: {
							'content-type': "application/json"
						},
						data: {
							bakeOrderDetailParamList: that.productList,
							deliveryAddress: shopAddr,
							message: that.remark,
							name: that.username,
							orderType: that.switchTab,
							phone: that.phone,
							pickUpTime: that.takeTime,
							shopId: shopid,
							userId: userid,
							totalPrice: that.totalPrice,
							shansongNo: that.sendNo,
							shansongPrice: (that.switchTab == 1 ? that.sendPrice : 0),
							freeType: that.freeType,
							carIds: carIds,
							greetingCard: that.greetingCard,
							tableware: that.tableware,
							imgUrl: img
						},
						success: res => {
							if (res.ResultCode === 0) {
								wx.removeStorageSync('cartDataItems')
								that.toPay(JSON.parse(res.ResultInfo))
							}else if(res.ResultCode ===1){
								wx.removeStorageSync('cartDataItems')
								wx.removeStorageSync('orderData')
								uni.showToast({
									title: '余额支付成功',
									icon:'success',
									mask: true
								});
								setTimeout(function() {
									that.isFollow = true
								}, 1500);
							}
						}
					})
				}
			},
			afterFree() {
				this.isFree = false
				if (this.orderType == 1 || this.orderType == 2) {
					this.delivery()
				} else {
					this.selfPick()
				}
			},
			checkFree() {
				// 先判断当前选择的日期是否在节假日中
				if (this.holiday != null && this.holiday.length > 0) {
					var tips = ''
					this.holiday.forEach((li) => {
						if (li.status == 1 && li.holiday == this.takeDay) {
							this.productList.forEach((goods) => {
								if (li.goodsIds.indexOf(goods.goodsId) > -1) {
									// 该商品存在
								} else {
									// 该商品不存在节假日指定购买商品中.提示他.
									tips += goods.goodsName + '节假日不能购买哦！'
								}
							})
						}
					})
					if (tips) {
						uni.hideLoading()
						uni.showModal({
							title: '提示',
							content: tips,
							showCancel: false,
							confirmText: '我知道了',
							success() {
								uni.switchTab({
									url: '/pages/menu/index'
								})
							}
						})
						this.isSubmit = true
						return
					}
				}
				let that = this
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/firstOrder',
					method: 'GET',
					success: res => {
						if (res.ResultCode === 0) {
							that.isFree = res.Data
							if (that.isFree) {
								if(that.ct > 0){
									let timer = setInterval(function(){
										if(that.ct > 0){
											that.ct --
										}else{
											clearInterval(timer)
										}
									},1000)
								}
								// 免单提示
								//that.freeTips = '查询到您还有一次免单未使用是否现在使用，立即充值￥' + (that.totalPrice.toFixed(2) * 4) + '元，即可免单哦'
							} else {
								if (that.orderType == 1 || this.orderType == 2) {
									this.delivery()
								} else {
									this.selfPick()
								}
							}
						}
					}
				})
			},
			getTime() {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/getPickUpTimeList',
					method: 'POST',
					success: res => {
						if (res.ResultCode === 0) {
							that.dayList = res.Data[0]
							that.nowTimeList = res.Data[1]
							if(that.nowTimeList == null || that.nowTimeList.length < 1){
								that.dayList.splice(0, 1)
								that.nowTimeList = res.Data[2]
							}
							that.timeList = res.Data[2]
						}
					}
				})
			},
			getTime1(){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/goodsMgr/getDeliveryTimeList',
					method: 'POST',
					success: res => {
						if (res.ResultCode === 0) {
							that.dayList = res.Data[0]
							that.nowTimeList = res.Data[1]
							if(that.nowTimeList == null || that.nowTimeList.length < 1){
								that.dayList.splice(0, 1)
								that.nowTimeList = res.Data[2]
							}
							that.timeList = res.Data[2]
						}
					}
				})				
			},
			getBalance() {
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/vip_serverMgr/getBalance',
					method: 'GET',
					success: res => {
						if (res.ResultCode == 0) {
							that.balance = res.Data
							if (that.balance > 0) {
								if (that.balance >= that.totalPrice) {
									that.sf = 0
								} else {
									that.sf = that.totalPrice - that.balance
								}
							}
						}
					}
				})
			},
			submit() {
				uni.showLoading({
					title: '下单中',
					mask: true
				})
				let token = uni.getStorageSync('token')
				if (!token) {
					uni.showToast({
						title: '请先登录！',
						icon: 'none'
					});
					setTimeout(function() {
						uni.navigateTo({
							url: '/packageUser/login/login'
						})
					}, 1500)
					return
				}
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if (this.switchTab == 1) {
					let addrs = wx.getStorageSync('defaultAddr')
					if (!addrs) {
						uni.showToast({
							title: '请选择地址！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
						return
					}
					if (!this.takeDay || !this.time) {
						uni.showToast({
							title: '请选择送达时间！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
						return
					} else {
						this.orderType = 1
						this.checkFree()
					}
				} else if(this.switchTab == 0){
					if (!this.username) {
						uni.showToast({
							title: '请输入姓名！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
					} else if (!this.phone) {
						uni.showToast({
							title: '请输入联系电话！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
					} else if (!phoneCodeVerification.test(this.phone)) {
						uni.showToast({
							title: '请输入正确的手机号！',
							duration: 2000,
							icon: 'none'
						});
					} else if (!this.takeDay || !this.time) {
						uni.showToast({
							title: '请选择取餐时间！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
					} else {
						this.orderType = 0
						this.checkFree()
					}
				}else if(this.switchTab == 2){
					if (!this.ad.name) {
						uni.showToast({
							title: '请输入姓名！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
					} else if (!this.ad.phone) {
						uni.showToast({
							title: '请输入联系电话！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
					} else if (!this.ad.regionTips) {
						uni.showToast({
							title: '请选择所在地区！',
							duration: 2000,
							icon: 'none'
						});
					} else if (!this.ad.detail) {
						uni.showToast({
							title: '请输入详细地址！',
							duration: 2000,
							icon: 'none'
						});
						this.isSubmit = true
					} else {
						this.orderType = 2
						this.checkFree()
					}
				}
			},
			goCan() {
				this.isCode = false
				this.checkFree()
			},
			goAdd() {
				this.isCode = false
				this.isEdit = true
			},
			codeHandle() {
				this.isEdit = false
				this.checkFree()
			},
			dayPick(item, index) {
				this.dayIndex = index
				this.timeIndex = null
				this.takeDay = item
			},
			timePick(item, index) {
				this.timeIndex = index
				this.time = item
				// if(this.switchTab){
				// 	this.takeTime=this.time
				// }else{
				this.takeTime = this.takeDay + ' ' + this.time
				// }
				this.timeShow = false
			},
			open() {
				// console.log('open');
				if (this.dayIndex == 0) {
					this.takeDay = this.dayList[0]
				}
			},
			close() {
				this.timeShow = false
				this.dayIndex = 0
				this.timeIndex = null
				// console.log('close');
			},
			handleSwitch(index) {
				this.switchTab = index
				this.timeIndex = null
				this.takeTime = ''
				this.sendPrice = 0
				if (this.balance > 0) {
					if (this.balance >= this.totalPrice) {
						this.sf = 0
					} else {
						this.sf = this.totalPrice - this.balance
					}
				}else{
					this.sf = this.totalPrice
				}
				if (index == 0) {
					this.getTime()
				}else if(index == 1){
					this.getSend()
					this.getTime1()
				}else if(index == 2){
					// 判断当前数据是否都可用使用快递
					var tips = ''
					this.productList.forEach((item) => {
						if(item.isWuliu != 1){
							if(tips){
								tips += '；'
							}
							tips += item.goodsName + '不支持快递'
						}
					})
					if(tips){
						uni.showModal({
							showCancel: false,
							confirmText: '我知道了',
							title: '提示',
							content: '请重新选择，' + tips,
							success() {
								uni.navigateBack({
									delta:1
								})
							}
						})
					}else{
						if(this.ad != null && this.ad.regionData != null && this.ad.regionData.length > 0){
							this.handleCountWeight()
						}
					}
				}
			},
			handleCountWeight(){
				// 运费计算.
				let weight = 0
				this.productList.forEach(item => {
					weight += item.weight * item.num
				})
				let price = 15
				let secondPrice = 2
				if(this.ad.regionData[1] != '杭州市'){
					price = 22
					secondPrice = 6
				}
				let totalPrice = 0
				if(weight > 1){
					totalPrice = price + (Math.ceil(weight / 1) - 1) * secondPrice
				}else{
					totalPrice = price
				}
				this.sendPrice = totalPrice
				if(this.balance > this.totalPrice){
					this.sf = 0
				}else{
					this.sf = this.totalPrice - this.balance
				}
				if(this.sendPrice > 0){
					this.sf += this.sendPrice
				}
			},
			getSend() {
				let that = this
				let addr = uni.getStorageSync('defaultAddr')
				if (addr || that.addr) {
					// 读取价格
					if (that.addr) {
						if (that.addr.province != addr.province || that.addr.city != addr.city || that.addr.district !=
							addr.district || that.addr.detail != addr.detail) {
							that.addr = addr
							that.loadSendPrice()
						}else{
							that.loadSendPrice()
						}
					} else {
						that.addr = addr
						that.loadSendPrice()
					}
				}
			},
			handleSwitchInit(flag) {
				if (flag) {
					this.getSend()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.free-wrap{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		background-color: rgba(0, 0, 0, 0.7);
		opacity: 0;
		visibility: hidden;
		transition: all .3s;
		padding-top: 28%;
		.free-box{
			width: 596rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.free-body{
				width: 100%;
				height: 834rpx;
				display: block;
				position: relative;
				.free-btns{
					display: flex;
					justify-content: space-between;
					position: absolute;
					left: 62rpx;
					right: 62rpx;
					bottom: 42rpx;
					.free-btn{
						width: 230rpx;
						height: 92rpx;
						display: block;
						position: relative;
						.free-btn-back{
							width: 100%;
							height: 100%;
							display: block;
						}
						.free-btn-text{
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							display: block;
							text-align: center;
							line-height: 92rpx;
							font-size: 30rpx;
							color: #333;
						}
					}
					.free-ok:first-child{
						.free-btn-text{
							color: #fff;
						}
					}
					.free-ok:last-child{
						padding: 0;
						margin: 0;
						box-sizing: border-box;
						background-color: transparent;
						border: none;
						border-radius: 46rpx;
						.free-btn-text{
							color: #000;
						}
					}
				}
				.free-content{
					position: absolute;
					top: 290rpx;
					left: 65rpx;
					right: 65rpx;
					font-size: 26rpx;
					line-height: 38rpx;
				}
				.free-title{
					position: absolute;
					top: 225rpx;
					left: 0;
					right: 0;
					text-align: center;
					font-size: 36rpx;
					font-weight: 600;
					color: #000;
				}
				.countdown{
					position: absolute;
					top: 125rpx;
					right: 15rpx;
					width: 64rpx;
					height: 64rpx;
					display: block;
					text-align: center;
					line-height: 64rpx;
					border-radius: 50%;
					background-color: rgba(255, 255, 255, 0.5);
					font-size: 26rpx;
					color: #565656;
				}
				.free-back{
					width: 100%;
					height: 100%;
					display: block;
				}
			}
			.free-fq{
				width: 310rpx;
				height: 76rpx;
				display: block;
				text-align: center;
				line-height: 76rpx;
				border-radius: 38rpx;
				background-color: rgba(255, 255, 255, 0.95);
				font-size: 26rpx;
				color: #333;
				margin-top: 32rpx;
			}
			.free-fq-disabled{
				background-color: #C6C6C6;
			}
		}
	}
	.free-wrap.active {
		opacity: 1;
		visibility: visible;
	}
	.photo-wrap{
		padding: 10rpx 0 0 0;
		display: flex;
		align-items: center;
		.cell-name{
			line-height: 80rpx;
			margin-bottom: 10rpx;
		}
	}
	.photo{
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		.pt{
			width: 80rpx;
			height: 80rpx;
			display: flex;
			margin: 0 0 10rpx 12rpx;
			background-color: #f7f8fa;
			border-radius: 4px;
			align-items: center;
			justify-content: center;
			position: relative;
			.co{
				position: absolute;
				top: 0;
				right: 0;
				padding: 5rpx;
				cursor: pointer;
			}
			.cl{
				width: 28rpx;
				height: 29rpx;
				display: block;
			}
			.pp{
				width: 80rpx;
				height: 80rpx;
				display: block;
				border-radius: 4rpx;
			}
			.add{
				width: 24rpx;
				height: 24rpx;
				display: block;
			}
		}
	}
	.tableWare-btn {
		margin: 30rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
		background-color: #333;
		color: #fff;
		border-radius: 10rpx;
	}

	.tableWare {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 0 30rpx;

		&-item {
			height: 68rpx;
			line-height: 68rpx;
			font-size: 30rpx;
			padding: 0 30rpx;
			border: solid 1px #ddd;
			border-radius: 10rpx;
			margin: 0 20rpx 20rpx 0;
		}

		&-item.active {
			border-color: #333;
		}
	}

	::v-deep .u-picker {
		.u-toolbar {
			height: 82rpx;

			.u-toolbar__wrapper__cancel,
			.u-toolbar__wrapper__confirm {
				font-size: 30rpx;
				padding: 0 30rpx;
			}
		}

		.u-picker__view__column__item {
			font-size: 32rpx;
		}
	}

	.picker {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.arrow {
			width: 14rpx;
			height: 24rpx;
			display: block;
			margin-left: 16rpx;
		}
	}

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
			padding-bottom: 50rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			border-radius: 8rpx;
			position: relative;
			
			.djs{
				position: absolute;
				top: 30rpx;
				right: 30rpx;
				font-size: 30rpx;
				color: #999;
			}

			.title {
				font-size: 36rpx;
				font-weight: 700;
				margin-top: 20rpx;
			}

			.cts {
				font-size: 30rpx;
				line-height: 42rpx;
				padding: 65rpx 40rpx 80rpx 40rpx;
				display: block;
			}

			.qrcode {
				width: 200rpx;
				height: 200rpx;
				display: block;
			}

			.tipss {
				width: 100%;
				font-size: 30rpx;
				line-height: 42rpx;
				display: block;
				box-sizing: border-box;
				text-align: center;
				padding: 20rpx 0;
			}

			.tips {
				width: 100%;
				font-size: 30rpx;
				line-height: 42rpx;
				padding: 45rpx 30rpx 100rpx 30rpx;
				display: block;
				box-sizing: border-box;
				text-align: center;

				.ti {
					width: 100%;
					display: block;
					padding-left: 32rpx;
					position: relative;
					font-size: 26rpx;
					line-height: 42rpx;
				}

				.ti::before {
					content: '';
					position: absolute;
					top: 14.5rpx;
					left: 4rpx;
					width: 13rpx;
					height: 13rpx;
					display: block;
					background-color: #AEA59B;
					overflow: hidden;
				}
			}

			.btns {
				display: flex;
			}
			
			.btnss{
				display: flex;
				justify-content: space-between;
			}
			
			.ct{
				width: 100%;
				height: 54rpx;
				display: block;
				text-align: center;
				font-size: 26rpx;
				color: #999;
			}

			.btn {
				width: 150rpx;
				height: 54rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				line-height: 54rpx;
				background-color: #333;
				border-radius: 27rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #fff;
			}
			.btn.ord{
				border: 1px solid #999999;
				color: #999999;
				background-color: transparent;
				padding: 0;
				margin: 0;
				box-sizing: border-box;
			}

			button::after{
				display: none;
			}
			.btn.cancle {
				background-color: #BFBFBF;
			}

			.btn+.btn {
				margin-left: 32rpx;
			}
			
			.b1{
				background-color: #333;
				border: 1px solid #333;
				color: #fff;
			}
			.b2{
				background-color: #666;
				border: 1px solid #666;
				color: #fff;
				padding: 0;
				margin: 0;
				box-sizing: border-box;
			}
			.b3{
				background-color: #999;
				border: 1px solid #999;
				color: #fff;
			}
		}
	}

	.pop-wrap.active {
		opacity: 1;
		visibility: visible;
	}

	.page-top {
		background-color: #fff;
		z-index: 10;
		position: fixed;
		top: 0;
		width: 100%;
	}

	.settlement-info {
		background-color: #fff;
		margin: 20rpx 25rpx;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 0 28rpx 0 26rpx;

		/deep/ .page-container {
			padding: 30rpx 0 40px 0 !important;
			border-bottom: 1rpx solid #F6F6F6;

			.other {
				max-width: 427rpx !important;
			}
		}

		.info-box {
			/deep/ .u-cell__body {
				height: 70rpx;
				padding: 0;
			}

			.cell-name {
				font-size: 28px;
				font-family: PingFang SC;
				color: #333333;
			}

			.cell-value {
				font-size: 28px;
				font-family: PingFang SC;
				color: #666666;
				// margin-right: 23rpx;
			}

			.nameInput {
				text-align: right;
				width: 440rpx;
			}
		}
	}

	.settlement-product {
		margin-top: 25rpx;
		padding: 30rpx 27rpx 0;
		border-radius: 12rpx;
		overflow: hidden;
		background-color: #fff;
	}
	
	.sl-line{
		width: 100%;
		height: 250rpx;
		display: block;
	}

	.settlement-totals {
		margin: 25rpx 0 25rpx 0;
		padding: 30rpx 27rpx 0;
		border-radius: 12rpx;
		overflow: hidden;
		background-color: #fff;

		.st {
			width: 100%;
			line-height: 80rpx;
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;

			.rt {
				font-weight: 700;
			}
		}
	}

	.take-time {
		width: 750rpx;
		height: 676rpx;

		/deep/ .u-icon--right {
			margin: 28rpx 8rpx 0 0;
		}

		&-header {
			width: 100%;
			height: 110rpx;
			text-align: center;
			line-height: 110rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
		}

		&-main {
			.scroll {
				width: 270rpx;
				height: 672rpx;
				overflow: hidden;
			}

			.day-item {
				width: 270rpx;
				height: 84rpx;
				background: #F8F8F8;
				text-align: center;
				line-height: 84rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				color: #333333;
			}

			.active {
				background: #fff;
				font-weight: bold;
				border-left: 8rpx solid #000;
			}

			.right {
				// height: 588rpx;
				height: 672rpx;
				overflow-y: scroll;
				text-align: left;
			}

			.time-item {
				height: 84rpx;
				padding-left: 29rpx;
				line-height: 84rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				color: #333333;
			}

			.cur {
				font-weight: bold;
			}
		}
	}

	.settlement-bottom {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0rpx 6rpx 32rpx 0rpx rgba(121, 121, 121, 0.18);
		line-height: 100rpx;
		padding-bottom: env(safe-area-inset-bottom);

		.total {
			font-size: 30rpx;
			font-family: PingFang SC;
			color: #333333;
			display: flex;
			flex-direction: column;
			padding: 8rpx 0 8rpx 25rpx;
			line-height: 46rpx;
			justify-content: center;
		}

		.send-unit {
			margin-left: 10rpx;
			font-size: 24rpx;
		}

		.send-price {
			font-size: 26rpx;
			color: #333;
		}

		.price-item {
			font-size: 30rpx;
			font-weight: bold;
			color: #000;

			.price {
				font-size: 38rpx;
			}
		}

		.btn {
			width: 191rpx;
			height: 100rpx;
			background: #333333;
			color: #fff;
			text-align: center;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
		}
	}
</style>