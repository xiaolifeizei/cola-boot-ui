import request from '@/utils/request'

export function getStorehouseTree(data) {
  return request({
    url: '/basics/storehouse/getStorehouseTree',
    method: 'post',
    data
  })
}

export function addStorehouse(data) {
  return request({
    url: '/basics/storehouse/addStorehouse',
    method: 'post',
    data
  })
}

export function updateStorehouse(data) {
  return request({
    url: '/basics/storehouse/updateStorehouse',
    method: 'post',
    data
  })
}

export function deleteStorehouse(data) {
  return request({
    url: '/basics/storehouse/deleteStorehouse',
    method: 'post',
    data
  })
}
