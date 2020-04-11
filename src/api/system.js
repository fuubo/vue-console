import request from './request'

const getPermissionTree = async () => {
  try {
    let result = await request.post('/system/permissionList')
    if (result.code === 0 && result.data instanceof Array) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api permissionList error', e)
    throw e
  }
}

const addPermission = async (params) => {
  try {
    let result = await request.post('/system/addPermission', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api addPermission error', e)
    throw e
  }
}

const editPermission = async (params) => {
  try {
    let result = await request.post('/system/editPermission', params);
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api editPermission error', e)
    throw e
  }
}

const closePermission = async (id) => {
  try {
    let result = await request.post(`/system/closePermission/${id}`);
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api closePermission error', e)
    throw e
  }
}

const reopenPermission = async (id) => {
  try {
    let result = await request.post(`/system/reopenPermission/${id}`);
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api reopenPermission error', e)
    throw e
  }
}
const getUserList = async (params) => {
  try {
    let result = await request.post('/system/getUserList', params)
    if (result.code === 0 && result.data.list instanceof Array) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api getUserList error', e)
    throw e
  }
}

const addUser = async (params) => {
  try {
    let result = await request.post('/system/addUser', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api addUser error', e)
    throw e
  }
}
const getRoleList = async (params) => {
  try {
    let result = await request.post('/system/getRoleList', params)
    if (result.code === 0 && result.data.list instanceof Array) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api getRoleList error', e)
    throw e
  }
}

const addRole = async (params) => {
  try {
    let result = await request.post('/system/addRole', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api addRole error', e)
    throw e
  }
}
const getDepartmentList = async (params) => {
  try {
    let result = await request.post('/system/getDepartmentList', params)
    if (result.code === 0 && result.data.list instanceof Array) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api getDepartmentList error', e)
    throw e
  }
}

const addDepartment = async (params) => {
  try {
    let result = await request.post('/system/addDepartment', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api addDepartment error', e)
    throw e
  }
}

const userAuthorization = async (params) => {
  try {
    let result = await request.post('/system/userAuthorization', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api userAuthorization error', e)
    throw e
  }
}

const roleAuthorization = async (params) => {
  try {
    let result = await request.post('/system/roleAuthorization', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api roleAuthorization error', e)
    throw e
  }
}

const getPermissionsByCondition = async (params) => {
  try {
    let result = await request.post('/system/getPermissionsByCondition', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api getPermissionsByCondition error', e)
    throw e
  }
}

const getAllRole = async (params) => {
  try {
    let result = await request.post('/system/getAllRole', params)
    if (result.code === 0 && result.data instanceof Array) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api setUserRole error', e)
    throw e
  }
}

const setUserRole = async (params) => {
  try {
    let result = await request.post('/system/setUserRole', params)
    if (result.code === 0) {
      return result.data;
    } else {
      throw {
        code: 100,
        message: result.message
      }
    }
  } catch (e) {
    console.error('api setUserRole error', e)
    throw e
  }
}


export {
  getPermissionTree,
  addPermission,
  editPermission,
  closePermission,
  reopenPermission,
  getUserList,
  getRoleList,
  getDepartmentList,
  addUser,
  addRole,
  addDepartment,
  userAuthorization,
  roleAuthorization,
  getPermissionsByCondition,
  setUserRole,
  getAllRole,
}