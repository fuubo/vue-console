import {
  getUser,
  login,
  logout,
  getMenuAndPermissions,
  getSystemUserMap,
  getSystemDistrictList,
  getSystemClubMap,
  getActivityCategoryMap,
} from '@/api'
import {
  SET_INFO,
  SET_LOGIN_STATE,
  SET_MENU,
  SET_SYSTEM_USER_MAP,
  SET_DISTRICTS,
  SET_SYSTEM_CLUB_MAP,
  SET_ACTIVITY_CATEGORY_MAP,
} from './mutation-types.js'
import {
  LOGINAUTHTOKEN
} from '../utils/constants'

const actions = {
  async GET_USER_INFO ({
    commit
  }) {
    let result = await getUser()
    commit(SET_LOGIN_STATE, 'yes')
    commit(SET_INFO, result.data)
  },
  async GET_MENU ({
    commit
  }) {
    let result = await getMenuAndPermissions()
    result.menuList = result.menuList.flat()
    let menuNames = ['登录', '首页', '个人中心']
    for (let list of result.permissionList) {
      menuNames.push(list.name)
    }
    result.menuNames = menuNames
    commit(SET_MENU, result)
  },
  async LOGIN_ACTION ({
    dispatch,
    commit
  }, loginData) {
    try {
      let result = await login(loginData)
      if (result && result.code === 200) {
        localStorage.setItem(LOGINAUTHTOKEN, result.data.token)
      }
      commit(SET_LOGIN_STATE, 'yes')
      dispatch('GET_USER_INFO')
      dispatch('GET_MENU')
    } catch (e) {
      localStorage.removeItem(LOGINAUTHTOKEN)
      throw e
    }
  },
  async LOGOUT_ACTION ({
    commit
  }) {
    await logout()
    commit(SET_INFO, null)
    commit(SET_MENU, null)
    commit(SET_LOGIN_STATE, null)
    localStorage.removeItem(LOGINAUTHTOKEN)
  },

  async GET_SYSTEM_USER_MAP ({
    commit
  }) {
    let res = await getSystemUserMap()
    commit(SET_SYSTEM_USER_MAP, res)
  },

  async GET_DISTRICTS ({
    commit
  }) {
    let districts = await getSystemDistrictList({
      levelList: [1, 2]
    })
    commit(SET_DISTRICTS, districts)
  },

  async GET_SYSTEM_CLUBS ({
    commit
  }) {
    let clubs = await getSystemClubMap()
    commit(SET_SYSTEM_CLUB_MAP, clubs)
  },

  async GET_ACTIVITY_CATEGORIES ({
    commit
  }) {
    let categories = await getActivityCategoryMap()
    commit(SET_ACTIVITY_CATEGORY_MAP, categories)
  },
}

export default actions