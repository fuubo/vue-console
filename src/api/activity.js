import request from './request'

const getActivityList = async (params) => {
    let result = await request.post('/activity/activityList', params);
    if (result.code === 0) {
        return result.data;
    } else {
        throw {
            code: 100,
            message: result.message
        }
    }

}

const addActivity = async (params) => {
    let result = await request.post('/activity/addActivityInfo', params);
    if (result.code === 0) {
        return result.data;
    } else {
        throw {
            code: 100,
            message: result.message
        }
    }
}

const getActivityCategoryMap = async (params) => {
    let result = await request.post('/activity/getActivityCategoryMap', params);
    if (result.code === 0) {
        return result.data;
    } else {
        throw {
            code: 100,
            message: result.message
        }
    }
}

const getActivityInfo = async (id) => {
    let result = await request.post(`/activity/getActivityInfo/${id}`);
    if (result.code === 0) {
        return result.data;
    } else {
        throw {
            code: 100,
            message: result.message
        }
    }
}

const deleteActivity = async (params) => {
    let result = await request.post('/activity/deleteActivity', params);
    if (result.code != 0) {
        throw {
            code: 100,
            message: result.message
        }
    }
}

export {
    getActivityList,
    addActivity,
    getActivityCategoryMap,
    getActivityInfo,
    deleteActivity,
}