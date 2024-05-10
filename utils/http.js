const baseUrl = 'https://bake.ranxy.cn'
// const baseUrl = 'https://admin.hzqz.cc'
const ossUrl = 'https://hpdg.oss-cn-hangzhou.aliyuncs.com'
const fetchData = function(params) {
	let _self = this;
	let requertUrl = baseUrl + params.url;
	let method = params.method || 'post';
	let header = params.header || {
		// 'content-type': "application/json"
		'content-type': "application/x-www-form-urlencoded"
	};
	let token = uni.getStorageSync('token')
	// debugger
	if (token) {
		let _token = {
			// 'Authorization': `Bearer ${token}`
			'Authorization': `bearer ${token}`
		}
		header = Object.assign(header, _token)
	}
	let data = params.data || {};
	let hideLoading = params.loading || false;
	if (!hideLoading) {
		// uni.showLoading({
		// 	title: '加载中...'
		// })
	}
	uni.request({
		url: requertUrl,
		method: method,
		header: header,
		data: data,
		success: function(res) {
			if (res.statusCode && res.statusCode != 200) { //api错误
				uni.showToast({
					title: res.errMsg,
					icon: 'none'
				})
				return;
			} else {
				uni.hideLoading()
				if (res.data.ResultCode !== 0) {
					if(res.data.ResultCode === 1){
						// 购买成功----余额支付
						params.success(res.data)
						//wx.removeStorageSync('cartDataItems')
						//wx.removeStorageSync('orderData')
						//uni.showToast({
						//	title: '余额支付成功',
						//	icon:'success',
						//	mask: true
						//});
						//setTimeout(function(){
						//	wx.removeStorageSync('orderData')
						//	uni.redirectTo({
						//		url:'/packageUser/order/orderPage'
						//	})
						//},1500)
					}else if(res.data.ResultCode == 401) {
						let r = res.data.ResultInfo.split('，')
						if(r[1]=='认证失败'){
							uni.showToast({
								title: '登录已过期，请重新登录',
								icon: 'none',
								duration: 2000
							})
							uni.removeStorageSync('token')
							setTimeout(function(){
								uni.navigateTo({
									url:'/packageUser/login/login'
								})
							},1500)
							return
						}
					}else{
						// if(res.data.ResultInfo == '地址超出配送范围，请联系客服下单' || res.data.ResultInfo == '获取配送费用失败,请正确填写信息'){
						// 	uni.showModal({
						// 		title: '提示',
						// 		content: '地址超出配送范围，请联系客服下单',
						// 		showCancel: false,
						// 		confirmText: '我知道了',
						// 		success() {
						// 			uni.switchTab({
						// 				url: '/pages/index/index'
						// 			})
						// 		}
						// 	})
						// }else{
						// 	uni.showToast({
						// 		title: res.data.ResultInfo,
						// 		icon: 'none',
						// 		duration: 2500
						// 	})
						// }
							uni.showToast({
								title: res.data.ResultInfo,
								icon: 'none',
								duration: 2500
							})
						if(res.data.ResultCode==-5||res.data.ResultCode==-8||res.data.ResultCode==-9){
							uni.removeStorageSync('token')
						}
					}
					return
				}else{
					params.success(res.data)
				}
				
			}
		},
		fail(res) {
			console.log(res)
			uni.hideLoading()
			uni.showToast({
				title: res,
				icon: 'none'
			})
		},
		complete(res) {
		}
	})
}

const uploadData = function(params) {
	let _self = this;
	let requertUrl = baseUrl + params.url;
	let filesPath = params.filePath
	let formData = params.data || null;
	let hideLoading = params.loading || false;
	if (!hideLoading) {
		uni.showLoading({
			title: '文件上传中...'
		})
	}
	uni.uploadFile({
		url: requertUrl,
		filePath: filesPath,
		fileType: 'file',
		name: 'file',
		formData: formData,
		success: function(res) {
			if (res.statusCode && res.statusCode != 200) { //api错误
				uni.showToast({
					title: res.errMsg,
					icon: 'none'
				})
				return;
			} else {
				uni.hideLoading()
				res.data=JSON.parse(res.data)
				if (res.data.ResultCode !== 0) {
					uni.showToast({
						title: '上传成功',
						icon: 'none'
					})
					return
				}
				params.success(res.data)
			}
		},
		fail(res) {
			uni.showToast({
				title: '请求失败',
				icon: 'none'
			})
		}
		// success: (uploadFileRes) => {
		// 	console.log(uploadFileRes.data);
		// 	_self.files = uploadFileRes.data.Data
		// 	_self.uploadFile()
		// }
	});
}
export default {
	fetchData,
	uploadData,
	baseUrl,
	ossUrl
}
