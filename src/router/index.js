import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import ArticleLists from '@/pages/ArticleLists'
import List from '@/components/list/List'
import addUserInfo from '@/components/userInfo/addUserInfo'
import UserInfoList from '@/components/userInfo/userInfoList'
import DefaulPhoto from '@/components/defaul/defaulPhoto'
import DefaulNickName from '@/components/defaul/defaulNickName'
import MedalType from '@/components/defaul/medalType'
import WishType from '@/components/wish/wishType'
import WishList from '@/components/wish/wishList'
import WishOpening from '@/components/wish/wishOpening'
import ActivityList from '@/components/activity/activityList'
import AddActivity from '@/components/activity/addActivity'
import ActivityCarousel from '@/components/activity/activityCarousel'
import AddActivityCarousel from '@/components/activity/addActivityCarousel'
import ActivityDetilList from '@/components/activityDetil/activityDetilList'
import ActivityWishList from '@/components/activityDetil/activityWishList'
import RePortList from '@/components/rePort/rePortList'
import UserCountList from '@/components/list/userCountList'
import Statistics from '@/components/statistics/statistics'
import Statistics2 from '@/components/statistics/statistics2'
import Permission from '@/components/permission/permission'
import AddcommonQuestion from '@/components/commonQuestion/addcommonQuestion'
import CommonQuestionList from '@/components/commonQuestion/commonQuestionList'
import Addbusiness from '@/components/business/addbusiness'
import BusinessList from '@/components/business/businessList'
import Settings from '@/components/generalSettings/settings'
import HomeWish from '@/components/generalSettings/homeWish'
import HomeActivity from '@/components/generalSettings/homeActivity'
import ComboSetting from '@/components/generalSettings/comboSetting'
import ContactUs from '@/components/generalSettings/contactUs'
import FeedBackList from '@/components/feedback/feedBackList'
import ActivityDetil from '@/components/activityDetil/activityDetil'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    }, {
      path: '/home',
      meta: {
        isAuthRequired:true
      },
      component: Home,
      children: [{
        path: '',
        component: ArticleLists
      }, {
        path: 'articleLists',
        component: ArticleLists
      }, {
        path: 'list',
        component: List
      },
      {
        path: 'userInfoList',
        component: UserInfoList
      },
      {
        path: 'addUserInfo',
        component: addUserInfo
      },
      {
        path: 'defaulPhoto',
        component: DefaulPhoto
      },
      {
        path: 'defaulNickName',
        component: DefaulNickName
      },
      {
        path: 'medalType',
        component: MedalType
      },
      {
        path: 'wishType',
        component: WishType
      },
      {
        path:'wishList',
        component:WishList
      },
      {
        path: 'activityList',
        component: ActivityList
      },
      {
        path:'addActivity',
        component:AddActivity
      },
      {
        path: 'activityDetilList',
        component: ActivityDetilList
      },
      {
        path:'activityWishList',
        component: ActivityWishList
      },
      {
        path:'rePortList',
        component: RePortList
      },
      {
        path:'userCountList',
        component:UserCountList
      },
      {
        path:'statistics',
        component:Statistics
      },
      {
        path:'statistics2',
        component:Statistics2
      },
      {
        path:'permission',
        component:Permission
      },
      {
        path:'addcommonQuestion',
        component:AddcommonQuestion
      },
      {
        path:'commonQuestionList',
        component:CommonQuestionList
      },
      {
        path:'addbusiness',
        component:Addbusiness
      },
      {
        path:'businessList',
        component:BusinessList
      },
      {
        path:'settings',
        component:Settings
      },
      {
        path:'comboSetting',
        component:ComboSetting
      },
      {
        path:'wishOpening',
        component:WishOpening
      },
      {
        path:'activityCarousel',
        component:ActivityCarousel
      },
      {
        path:'addActivityCarousel',
        component:AddActivityCarousel
      },
      {
        path:'homeWish',
        component:HomeWish
      },
      {
        path:'homeActivity',
        component:HomeActivity
      },
      {
        path:'contactUs',
        component:ContactUs
      },
      {
        path:'feedBackList',
        component:FeedBackList
      },
      {
        path:'activityDetil',
        component:ActivityDetil
      }
    ]
    }
  ]
})
