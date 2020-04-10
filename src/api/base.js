import request from './request'
let OSS = require('ali-oss');

const login = async (loginData) => {
  let result = await request.post('/login/login', {
    userName: loginData.username,
    password: loginData.password
  })
  if (result.code === 0) {
    return result
  } else {
    throw {
      code: 100,
      message: result.message
    }
  }
}

const logout = async () => {
  let result = await request.post('/logout')
  return result;
}

const getUser = async () => {
  try {
    let result = await request.post('/login/currentUser')
    console.log('getUser result', result)
    if (result.code === 0) {
      return result
    } else {
      console.error('api getUser error', result)
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api getUser error', e)
    throw e
  }
}

// setPassword
const setPassword = async (oldPassword, password) => {
  try {
    await request.post('/system/updatePassword', {
      oldPassword, password
    })
  } catch (e) {
    console.error('api setPassword error', e)
    throw e
  }
}


const getMenuAndPermissions = async () => {
  try {
    let result = await request.post('/login/getMenuAndPermissions')
    if (result.code === 0) {
      console.log(result.data)
      return result.data
    } else {
      console.error('api getMenuAndPermissions error', result)
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api getMenuAndPermissions error', e)
    throw e
  }
}

const getAliOssToken = async () => {
  try {
    let token = window.localStorage.getItem('ossToken')
    if (token) {
      token = JSON.parse(token)
      let expire = new Date(token.expiration)
      let now = new Date()
      if (expire > now) {
        return token
      } else {
        token = null
      }
    }

    if (!token) {
      let result = await request.post('/aliOss/getToken')
      if (result.code === 0) {
        window.localStorage.setItem('ossToken', JSON.stringify(result.data))
        return result.data
      } else {
        console.error('api getAliOssToken error', result)
        throw {
          code: 100,
          message: result.message
        }
      }
    }

  } catch (e) {
    console.error('api getAliOssToken error', e)
    throw e
  }
}


const uploadOSS = async (url, file, bucket) => {
  try {
    let data = await getAliOssToken()
    bucket = bucket || 'image'
    console.log(data)
    let client = new OSS({
      region: 'oss-cn-zhangjiakou',
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      bucket: `retry-${bucket}`,
      secure: true
    });
    let result = await client.put(url, file);
    return result
  } catch (e) {
    console.error('api uploadOSS error', e)
    throw e
  }
}


const getOSSfile = async (url) => {
  try {
    let data = await getAliOssToken()
    let client = new OSS({
      region: 'oss-cn-zhangjiakou',
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
      stsToken: data.securityToken,
      bucket: 'retry-image',
      secure: true
    });
    let result = await client.signatureUrl(url);
    return result
  } catch (e) {
    console.error('api uploadOSS error', e)
    throw e
  }
}

export {
  login,
  logout,
  setPassword,
  getUser,
  getMenuAndPermissions,
  uploadOSS,
  getOSSfile,
}