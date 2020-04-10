import {
  getUser,
  login,
  logout,
  getMenuAndPermissions,
} from '@/api'
import {
  SET_INFO,
  SET_LOGIN_STATE,
  SET_MENU,
} from './mutation-types.js'
import {
  LOGINAUTHTOKEN
} from '../utils/constants'

const actions = {
  async GET_USER_INFO({
    commit
  }) {
    let result = await getUser()
    commit(SET_LOGIN_STATE, 'yes')
    commit(SET_INFO, result.data)
  },
  async GET_MENU({
    commit
  }) {

    let result = await getMenuAndPermissions();
    result.menuList = result.menuList.flat();
    let menuNames = ['登录', '首页', '个人中心'];
    for (let list of result.permissionList) {
      menuNames.push(list.name);
    }
    result.menuNames = menuNames;
    commit(SET_MENU, result)
  },
  async LOGIN_ACTION({
    dispatch,
    commit
  }, loginData) {
    try {
      let result = await login(loginData)
      if (result && result.code === 0) {
        localStorage.setItem(LOGINAUTHTOKEN, result.data.token);
      }
      commit(SET_LOGIN_STATE, 'yes')
      dispatch('GET_USER_INFO')
      dispatch('GET_MENU')
    } catch (e) {
      localStorage.removeItem(LOGINAUTHTOKEN)
      throw e
    }
  },
  async LOGOUT_ACTION({
    commit
  }) {
    await logout()
    commit(SET_INFO, null)
    commit(SET_MENU, null)
    commit(SET_LOGIN_STATE, null)
    localStorage.removeItem(LOGINAUTHTOKEN)
  },
}

export default actions