<template>
	<view class="wrap">
		<view class="page-top" :style="{'padding-top':statusBarHeight+'px'}">
			<commonNavbar leftText="生日提醒"></commonNavbar>
		</view>
		<view class="form">
		    <view class="form-item">
		        <text>生日类型</text>
		        <picker class="input" mode="selector" :value="current" range-key="key" :range="mode" @change="bindModeChange">
		            <view class="input">
		                <text class="text">{{mode[current].key}}</text>
		                <image class="arrow" src="../../static/arrow-down-small.png" />
		            </view>
		        </picker>
		    </view>
		    <view class="form-item">
		        <text v-if="remindermethod==2">公历生日</text>
		        <text v-else>生日</text>
		        <picker class="input" mode="date" :value="birthday" @change="bindDateChange" :end="maxDate">
		            <view class="input">
		                <text class="text" :class="birthday==null?'place':''">{{birthday==null?'请选择':birthday}}</text>
		                <image class="arrow" src="../../static/arrow-down-small.png" />
		            </view>
		        </picker>
		    </view>
		    <view class="form-item" v-if="remindermethod==2">
		        <text>农历</text>
		        <view class="inputbox">{{birthdayOld}}</view>
		    </view>
		    <view class="form-item">
		        <text>关系</text>
		        <input type="text" class="inputbox" placeholder="请输入" maxlength="20" v-model="relationship" />
		    </view>
		    <view class="form-item">
		        <text>备注</text>
		        <input type="text" class="inputbox" placeholder="请输入" maxlength="30" v-model="message" />
		    </view>
		</view>
		<view class="form">
		    <view class="form-item">
		        <text>提醒时间</text>
		        <picker class="input" mode="selector" :value="type" range-key="key" :range="range" @change="bindTypeChange">
		            <view class="input">
		                <text class="text">{{range[type].key}}</text>
		                <image class="arrow" src="../../static/arrow-down-small.png" />
		            </view>
		        </picker>
		    </view>
		</view>
		<view class="delete__btn" @click="del" v-if="pid">删除提醒</view>
		<view class="footer__btn" @click="submit">保存</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				shopid: '',
				userid: '',
				pid: '',
				maxDate: null,
				name: '',
				phone: '',
				birthday: null,
				message: '',
				relationship: '',
				type: 0,
				range: [],
				remindermethod: 1,
				current: 0,
				mode: [{ key: '公历', value: 1 }, { key: '农历', value: 2 }],
				birthdayOld: '',
				model: null
			}
		},
		computed:{
			...mapGetters(['statusBarHeight'])
		},
		onLoad(param) {
			this.userid = uni.getStorageSync('userid')
			this.shopid = uni.getStorageSync('shopid')
			if(param.pid){
				this.pid = param.pid
			}
			this.loadRange()
		},
		onShow() {
			let date = new Date()
			this.maxDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
			this.loadDetails()
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
				that.$http.fetchData({
					url: '/front/userMgr/getInfo',
					method: 'GET',
					data: {
						userid: that.userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							that.model=res.Data
							if(that.model != null){
								that.name = that.model.nickname
								that.phone = that.model.mobile
							}
						}
					}
				})
			},
			del () {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除提醒吗？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#666666',
					confirmText: '确定',
					confirmColor: '#000000',
					success: (result) => {
						if (result.confirm) {
							that.delApi()
						}
					}
				})
			},
			delApi () {
				uni.showLoading({ title: '', mask: true })
				let that = this
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url:'/front/merchant/bake/birthdayReminder/deleteReminder',
					method:'POST',
					data:[that.pid],
					success: res=>{
						if(res.ResultCode == 0){
							uni.showToast({ title: res.ResultInfo })
							setTimeout(() => {
								uni.navigateBack({ delta: 1 })
							}, 1500)
						}else{
							uni.showToast({ title: res.ResultInfo, icon: 'none' })
						}
					}
				})
			},
			loadDetails(){
				if (this.pid) {
					let that = this
					that.$http.fetchData({
						header: {
							"Content-Type": "application/json;charset=utf-8;"
						},
						url:'/front/merchant/bake/birthdayReminder/birthdayReminderInfoNew',
						method:'GET',
						data:{
							pid: that.pid
						},
						success: res=>{
							if(res.ResultCode == 0){
								let type = 0
								that.range.forEach((item, index) => {
								    if (item.value == res.Data.type) {
								        type = index
								    }
								})
								let current = 0
								if (parseInt(res.Data.remindermethod) == 2) {
								    current = 1
								}
								that.birthday= res.Data.birthday
								that.message= res.Data.message
								that.relationship= res.Data.relationship
								that.type= type
								that.birthdayOld= res.Data.lunarcalendar
								that.remindermethod= parseInt(res.Data.remindermethod)
								that.current= current
							}
						}
					})
				}
			},
			submit(){
				uni.showLoading({ title: '提交中', mask: true })
				if (uni.$u.test.isEmpty(this.birthday)) {
					uni.showToast({ title: '请选择生日', icon: 'none' })
					return
				}
				if (uni.$u.test.isEmpty(this.relationship)) {
					uni.showToast({ title: '请输入关系', icon: 'none' })
					return
				}
				let model = {
					shopid: this.shopid,
					name: this.name,
					phone: this.phone,
					bbuid: this.userid,
					birthday: this.birthday,
					relationship: this.relationship,
					message: this.message,
					type: this.range[this.type].value,
					remindermethod: this.remindermethod,
					lunarcalendar: this.birthdayOld
				}
				if (this.pid) {
					model.pid = this.pid
					this.editApi(model)
				} else {
					this.addApi(model)
				}
			},
			async addApi (model) {
				let that = this
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url:'/front/merchant/bake/birthdayReminder/addReminder',
					method:'POST',
					data:model,
					success: res=>{
						if(res.ResultCode == 0){
							uni.showToast({ title: res.ResultInfo })
							setTimeout(() => {
								uni.navigateBack({ delta: 1 })
							}, 1500)
						}else{
							uni.showToast({ title: res.ResultInfo, icon: 'none' })
						}
					}
				})
			},
			async editApi (model) {
				let that = this
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url:'/front/merchant/bake/birthdayReminder/modifybirthdayReminder',
					method:'POST',
					data:model,
					success: res=>{
						if(res.ResultCode == 0){
							uni.showToast({ title: res.ResultInfo })
							setTimeout(() => {
								uni.navigateBack({ delta: 1 })
							}, 1500)
						}else{
							uni.showToast({ title: res.ResultInfo, icon: 'none' })
						}
					}
				})
			},
			bindTypeChange(e){
				this.type = e.detail.value
			},
			bindDateChange(e){
				this.birthday = e.detail.value
				if(this.remindermethod == 2){
					this.handleRY()
				}
			},
			bindModeChange(e){
				this.current = e.detail.value
				this.remindermethod = this.mode[e.detail.value].value
				if(this.remindermethod == 2 && this.birthday){
					this.handleRY()
				}
			},
			handleRY(){
				let that = this
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url:'/front/merchant/bake/birthdayReminder/gregorianCalendarToLunarCalendar',
					method:'POST',
					data:{
						solar: that.birthday
					},
					success: res=>{
						if(res.ResultCode == 0){
							this.birthdayOld = res.Data.lunarCalendar
						}
					}
				})
			},
			loadRange(){
				let that = this
				that.$http.fetchData({
					header: {
						"Content-Type": "application/json;charset=utf-8;"
					},
					url: '/front/merchant/bake/birthdayReminder/reminderTime',
					method: 'GET',
					data: {
						page: 1,
						limit: 10000,
						pid: that.userid
					},
					success: res => {
						if (res.ResultCode === 0) {
							this.range  = res.Data
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.delete__btn {
    width: 100%;
    height: 100rpx;
    display: block;
    line-height: 100rpx;
    text-align: center;
    font-size: 30rpx;
    margin-top: 18rpx;
    background-color: #fff;
}
.footer__btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    line-height: 78rpx;
    display: block;
    text-align: center;
    background-color: #333;
    padding-bottom: env(safe-area-inset-bottom);
    font-size: 30rpx;
    color: #fff;
    font-weight: bold;
    z-index: 9;
}
	.page-top{
		background-color: #fff;
		width: 100%;
		display: block;
	}
	.form {
	    width: 100%;
	    display: block;
	    margin-top: 15rpx;
	    background-color: #fff;
	
	    &-item {
	        width: 100%;
	        height: 100rpx;
	        line-height: 100rpx;
	        display: flex;
	        padding: 0 25rpx;
	        border-top: solid 1px #f5f5f5;
	        font-size: 30rpx;
	
	        .inputbox {
	            flex: 1;
	            padding: 0 0 0 30rpx;
	            height: 100rpx;
	            line-height: 100rpx;
	            display: block;
	            font-size: 26rpx;
	            text-align: right;
	        }
	
	        .input {
	            flex: 1;
	            margin-left: 30rpx;
	            height: 100rpx;
	            display: flex;
	            font-size: 26rpx;
	            align-items: center;
	            line-height: 100rpx;
	            justify-content: flex-end;
	            text-align: right;
	
	            .text {
	                flex: 1;
	                text-align: right;
	            }
	
	            .place {
	                color: #999;
	            }
	
	            .arrow {
	                width: 22rpx;
	                height: 12rpx;
	                display: block;
	                margin-left: 16rpx;
	            }
	        }
	    }
	
	    &-item:first-child {
	        border-top: 0;
	    }
	}
</style>