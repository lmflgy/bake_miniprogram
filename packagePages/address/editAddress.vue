<template>
	<view>
	<view class="edit-page">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="收货地址"></commonNavbar>
		</view>
		<view class="form">
			<view class="item u-flex u-col-center">
				<view class="item-title">
					收货人
				</view>
				<view class="item-input u-flex-1">
					<u--input
					  placeholder="姓名"
					  border="none"
					  v-model="addressData.name"
						fontSize="28rpx"
					></u--input>
				</view>
			</view>
			<view class="item u-flex u-col-center">
				<view class="item-title">
					性别
				</view>
				<view class="item-input u-flex-1" @click="showSex=true">
					<u--input
					  placeholder="请选择"
					  border="none"
						disabled
						disabledColor="#ffffff"
						fontSize="28rpx"
					  v-model="addressData.gender"
					></u--input>
				</view>
				<image src="../../static/right.png" mode="" class="item-icon" @click="showSex=true"></image>
			</view>
			<view class="item u-flex u-col-center">
				<view class="item-title">
					联系电话
				</view>
				<view class="item-input u-flex-1">
					<u--input
					  placeholder="手机号"
					  border="none"
					  v-model="addressData.phone"
						fontSize="28rpx"
					></u--input>
				</view>
			</view>
			<view class="item u-flex u-col-center">
				<view class="item-title">
					收货地址
				</view>
				<view class="item-input u-flex-1" @click="openCity">
					<u--input
					  placeholder="请选择"
					  border="none"
						disabled
						disabledColor="#ffffff"
						fontSize="28rpx"
					  v-model="addressData.region"
					></u--input>
				</view>
				<image src="../../static/right.png" mode="" class="item-icon" @click="openCity"></image>
			</view>
			<view class="item u-flex u-col-center">
				<view class="item-title">
					详细地址
				</view>
				<view class="item-location u-flex-1" @click="openLocation">
					<template v-if="addressData.detail">{{addressData.detail}}</template>
					<template v-else>请选择详细地址</template>
				</view>
				<image src="../../static/right.png" mode="" class="item-icon" @click="openLocation"></image>
			</view>
			<view class="item u-flex u-col-center">
				<view class="item-title">
					门牌号
				</view>
				<view class="item-input u-flex-1">
					<u--input
					  placeholder="填写详细门牌号，例：1层101室"
					  border="none"
					  v-model="addressData.houseNumber"
						fontSize="28rpx"
					></u--input>
				</view>
			</view>
		</view>
		<view class="other">
			<view class="item other-item u-flex u-col-center">
				<view class="item-title">
					标签
				</view>
				<view class="item-input u-flex-1 u-flex">
					<view class="item-tag" v-for="(item,index) in tags" :key="index" :class="item.value==tagIndex?'tag-select':''" @click="handleTag(item,index)">
						{{item.key}}
					</view>
				</view>
			</view>
			<view class="item other-item u-flex u-col-center u-row-between">
				<view class="item-title">
					默认地址
				</view>
				<view class="">
					<u-switch v-model="addressData.isDefault" active-color="#666" inactive-color="#F6F6F6"></u-switch>
				</view>
			</view>
		</view>
		<view class="page-bottom" @click="submit">
			保存
		</view>
		<u-action-sheet
			:show="showSex"
			:actions="actions"
			title="请选择性别"
			@close="showSex = false"
			@select="sexSelect"
		>
		</u-action-sheet>
		<u-picker ref="cityPick" :defaultIndex="defaultIndex" :show="showCity" :columns="columnCity" @change="cityChange" keyName="label" @confirm="confirmCity" @cancel="cancelCity"></u-picker>
	</view>
	
	<view class="privacy" v-if="showPrivacy">
		<view class="content_privacy">
			<view class="title">隐私保护指引</view>
			<view class="des">
				在使用当前小程序服务之前，请仔细阅读<text class="link" @tap="openPrivacyContract">{{ privacyContractName }}</text>。如你同意{{
					privacyContractName }}，请点击“同意”开始使用。
			</view>
			<view class="btns">
				<button class="item reject" @tap="exitMiniProgram">拒绝</button>
				<button id="agree-btn" class="item agree" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import city from '@/utils/country-data.js';
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				addressData:{
					name: '',
					gender: '',
					phone: '',
					region: '',
					detail: '',
					houseNumber: '',
					label: '',
					isDefault: 0,
					lng: '',
					lat: ''
				},
				showSex: false,
				actions: [
					{name: '男'},
					{name: '女'}
				],
				columnCity: [city],
				showCity: false,
				// valueCity: '',
				indexs: '',
				tags:[],
				tagIndex: null,
				province: '',
				city: '',
				district: '',
				type: '',
				defaultIndex: [0,0,0],
				privacyContractName: '《微信隐私保护引导》',
				showPrivacy: false,
				resolvePrivacyAuthorization: null
			};
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onLoad:function(option){	
			
			//this.checkPrivacySetting()
			if(option.addr){
				this.type=1
				let addr = JSON.parse(option.addr)
				this.addressData=addr
				let temp = addr.province+ ' '+addr.city+ ' '+addr.district
				this.addressData.region = temp
				this.province=addr.province
				this.city=addr.city
				this.district=addr.district
				this.$set(this.addressData,'isDefault',!!addr.isDefault)
			}else{
				this.type=0
				this.addressData={
					name: '',
					gender: '',
					phone: '',
					region: '',
					detail: '',
					houseNumber: '',
					label: '',
					isDefault: 0
				}
			}
			this.getTags()
		},
		onShow() {
			
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
			checkPrivacySetting(){
				uni.getPrivacySetting({
					  success: res => {
						console.log("getPrivacySetting",res)
						// 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
						if (!res.needAuthorization) {
						  // 需要弹出隐私协议
							this.privacyContractName = res.privacyContractName
							this.showPrivacy = true
						} else {
						  // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
						}
					  },
					  fail: () => {},
					  complete: () => {}
				})
			},
			// 打开隐私协议
			openPrivacyContract() {
				uni.openPrivacyContract({
					fail: () => {
						uni.showToast({
							title: '遇到错误',
							icon: 'error'
						})
					}
				})
			},
			// 同意隐私协议
			handleAgreePrivacyAuthorization() {
				let that = this
				uni.requirePrivacyAuthorize({
					  success: (res) => {
						console.log(res)
						// 用户同意授权
						// 继续小程序逻辑
						// 告知微信？
						 that.showPrivacy = false
						 that.resolvePrivacyAuthorization && that.resolvePrivacyAuthorization({ buttonId: "agree-btn", event: "agree" });
					  },
					  fail: () => {}, // 用户拒绝授权
					  complete: () => {}
					})
			},
			// 拒绝隐私协议
			exitMiniProgram() {
				console.log("拒绝隐私协议")
				const that = this;
				// 直接退出小程序
				// wx.exitMiniProgram()
				uni.showModal({
					// 如果拒绝,我们将无法获取您的信息, 包括手机号、位置信息、相册等该小程序十分重要的功能,您确定要拒绝吗?
					content: '您确定要拒绝吗?',
					success: res => {
						if (res.confirm) {
							that.showPrivacy = false;
							uni.exitMiniProgram({
								success: () => {
									console.log('退出小程序成功');
								}
							});
						}
					}
				});
			},
			openLocation(){
				let that = this
				wx.chooseLocation({
					success: function (res) {
						that.addressData.detail = res.name
						that.addressData.lng = res.longitude
						that.addressData.lat = res.latitude
					}
				})			
			},
			getTags(){
				let that = this
				that.$http.fetchData({
					url: '/front/user/bake/shippingAddressMgr/listOfTags',
					method: 'GET',
					success: res => {
						if (res.ResultCode === 0) {
							that.tags=res.Data
							if(that.type){
								that.tags.forEach(item=>{
									if(item.key==that.addressData.label){
										that.tagIndex=item.value
									}
								})
							}
						}
					}
				})
			},
			submit(){
				let phoneCodeVerification = /^[1][3-9][0-9]{9}$/;
				if(this.addressData.name==''){
					uni.showToast({
					  title: '请输入收货人！',
					  duration: 2000,
						icon:'none'
					});
				}else if(this.addressData.gender ==''){
					uni.showToast({
					  title: '请选择性别！',
					  duration: 2000,
						icon:'none'
					});
				}else if(this.addressData.phone ==''){
					uni.showToast({
					  title: '请输入手机号！',
					  duration: 2000,
						icon:'none'
					});
				}else if(!phoneCodeVerification.test(this.addressData.phone)){
					uni.showToast({
						title: '请输入正确的手机号！',
						duration: 2000,
						icon:'none'
					});
				}else if(this.addressData.region==''){
					uni.showToast({
					  title: '收货地址不能为空！',
					  duration: 2000,
						icon:'none'
					});
				}else if(this.addressData.detail=='' || this.addressData.lat=='' || this.addressData.lng==''){
					uni.showToast({
					  title: '请选择详细地址！',
					  duration: 2000,
						icon:'none'
					});
				}else if(this.addressData.houseNumber == ''){
					uni.showToast({
					  title: '请输入门牌号！',
					  duration: 2000,
						icon:'none'
					});
				}else{
					this.addressData.isDefault=Number(this.addressData.isDefault)
					console.log('地址',this.addressData)
					if(this.addressData.isDefault){
						wx.setStorageSync('defaultAddr',this.addressData)
					}
					if(this.type){
						this.update()
					}else{
						this.add()
					}
				}
			},
			update(){
				let that = this
				let userid = wx.getStorageSync('userid')
				that.$http.fetchData({
					url: '/front/user/bake/shippingAddressMgr/update',
					header: {
						'content-type': "application/json"
					},
					data: {
						province: that.province,
						city: that.city,  // 市
						district: that.district,  // 所在区/县
						detail: that.addressData.detail,  // 详细地址
						lng: that.addressData.lng,
						lat: that.addressData.lat,
						gender: that.addressData.gender,  // 性别;
						isDefault: that.addressData.isDefault,  // 默认;（0否 1是）
						label: that.addressData.label,  // 标签;（
						name: that.addressData.name,  // 收货人姓名
						phone: that.addressData.phone,  // 联系电话
						houseNumber: that.addressData.houseNumber, // 门牌号
						userId: userid,
						pid: that.addressData.pid
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
								title: '修改成功',
								icon: "success"
							})
							// uni.navigateTo({
							// 	url:'/packagePages/address/index'
							// })
							uni.navigateBack()
						}
					}
				})
			},
			add(){
				let that = this
				let userid = wx.getStorageSync('userid')
				that.$http.fetchData({
					url: '/front/user/bake/shippingAddressMgr/Add',
					header: {
						'content-type': "application/json"
					},
					data: {
						province: that.province,
						city: that.city,  // 市
						district: that.district,  // 所在区/县
						detail: that.addressData.detail,  // 详细地址
						lng: that.addressData.lng,
						lat: that.addressData.lat,
						gender: that.addressData.gender,  // 性别;
						isDefault: that.addressData.isDefault,  // 默认;（0否 1是）
						label: that.addressData.label,  // 标签;（
						name: that.addressData.name,  // 收货人姓名
						phone: that.addressData.phone,  // 联系电话
						houseNumber: that.addressData.houseNumber, // 门牌号
						userId: userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							uni.showToast({
								title: '添加成功',
								icon: "success"
							})
							uni.navigateBack()
						}
					}
				})
			},
			handleTag(item,index){
				this.tagIndex = item.value
				this.addressData.label = item.key
			},
			// 选择性别
			sexSelect(e){
				this.addressData.gender=e.name
			},
			//点击城市下拉框
			openCity() {
				let _that = this;
				//console.log(_that.columnCity[0][1].children)
				if(this.province){
					let defaultIndex = []
					this.showCity = true;
					this.columnCity[0].forEach((item,i) => {
						//console.log(item.value == _that.province)
						if(item.value == this.province){
							defaultIndex.push(i)
							console.log(item)
							this.$refs.cityPick.setColumnValues(1, item.children);
							item.children.forEach((child,j) => {
								if(child.value == this.city){
									defaultIndex.push(j)
									this.$refs.cityPick.setColumnValues(2, child.children);
									child.children.forEach((li,l) => {
										if(li.value == this.district){
											defaultIndex.push(l)
											this.defaultIndex = defaultIndex
										}
									})
								}
							})
						}
					})
				}else{
					_that.showCity = true;
					_that.$refs.cityPick.setColumnValues(1, _that.columnCity[0][1].children); // 解决第一次打开没有二级联动的问题
					_that.$refs.cityPick.setColumnValues(2, _that.columnCity[0][0].children[0].children); // 解决第一次打开没有三级联动的问题
				}
			},
			cityChange(e) {
				let _that = this;
				const { columnIndex, value, values, index } = e;
				if (columnIndex === 0) {
					_that.$refs.cityPick.setColumnValues(1, _that.columnCity[0][index].children);
					_that.$refs.cityPick.setColumnValues(2, _that.columnCity[0][index].children[0].children);
					_that.indexs = index;
				} else if (columnIndex === 1) {
					_that.$refs.cityPick.setColumnValues(2, _that.columnCity[0][_that.indexs].children[index].children);
				}
			},
			//城市确定
			confirmCity(e) {
				let _that = this;
				let valueCity = e.value[0].value + ' ' + e.value[1].value + ' ' + e.value[2].value;
				// _that.citys = e.value[0].value + ',' + e.value[1].value + ',' + e.value[2].value;
				_that.province=e.value[0].value
				_that.city=e.value[1].value
				_that.district=e.value[2].value
				_that.showCity = false;
				_that.addressData.region = valueCity
			},
			//城市取消
			cancelCity() {
				let _that = this;
				_that.showCity = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './editAddress.scss';
</style>