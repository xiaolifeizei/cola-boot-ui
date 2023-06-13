import request from '@/utils/request'

export function getWorkstationWrapperList(data) {
  return request({
    url: '/basics/workstation/getWorkstationWrapperList',
    method: 'post',
    data
  })
}

export function addWorkstation(data) {
  return request({
    url: '/basics/workstation/addWorkstation',
    method: 'post',
    data
  })
}

export function updateWorkstation(data) {
  return request({
    url: '/basics/workstation/updateWorkstation',
    method: 'post',
    data
  })
}

export function deleteWorkstation(data) {
  return request({
    url: '/basics/workstation/deleteWorkstation',
    method: 'post',
    data
  })
}
