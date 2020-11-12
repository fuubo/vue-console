import request from './request'

const getFileList = async (params) => {
  let result = await request.post('/file/list', params)
  if (result.code === 200) {
    return result.data
  } else {
    throw {
      code: 100,
      message: result.message
    }
  }
}

const uploadExcelCombination = async (params) => {
  let result = await request.post('/file/uploadExcelCombination', params)
  if (result.code === 200) {
    return result.data
  } else {
    throw {
      code: 100,
      message: result.message
    }
  }
}

const downloadExcelCombination = async (params) => {
  try {
    let result = await request.post('/file/downloadExcelCombination', params, 'blob')
    return result
  } catch (e) {
    console.error('api downloadExcelCombination error', e)
    throw e
  }
}

export {
  getFileList,
  uploadExcelCombination,
  downloadExcelCombination
}