import {
  SET_INFO,
  SET_LOGIN_STATE,
  USERLOGOUT,
  SET_MENU,
} from './mutation-types.js'
import {
  LOGINAUTHTOKEN
} from '../utils/constants'

const mutations = {
  [SET_INFO]: (state, info) => {
    state.userInfo = info
  },
  [SET_MENU]: (state, menu) => {
    state.menu = menu
  },
  [SET_LOGIN_STATE]: (state, status) => {
    state.islogin = status
  },
  [USERLOGOUT]: (state) => {
    localStorage.removeItem(LOGINAUTHTOKEN)
    state.islogin = null
    state.userInfo = null
  },
}
export default mutations