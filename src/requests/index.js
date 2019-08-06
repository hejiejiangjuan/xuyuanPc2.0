import axios from 'axios'

const ajax = axios.create({
  baseURL: 'http://rap2api.taobao.org/app/mock/119554'
})

// 轮播图
export const getSwiper = () => {
  return ajax.get('/app/maomi/h1')
}

// 通知
export const getNotice = () => {
  return ajax.get('app/maomih3')
}
// 获取分类菜单
export const getCateNav = () => {
  return ajax.get('/api/maomi/h2')
}
// 获取分类列表
export const getCatelist = (categotyTitle, categotyID) => {
  return axios.get(`/dang/ddcategory.php?action=get_content&title=${categotyTitle}&pageid=${categotyID}`)
}
