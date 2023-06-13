import request from '@/utils/request'

export function getTruckPage(data) {
  return request({
    url: '/basics/truck/getTruckPage',
    method: 'post',
    data
  })
}

export function addTruck(data) {
  return request({
    url: '/basics/truck/addTruck',
    method: 'post',
    data
  })
}

export function updateTruck(data) {
  return request({
    url: '/basics/truck/updateTruck',
    method: 'post',
    data
  })
}

export function deleteTruck(data) {
  return request({
    url: '/basics/truck/deleteTruck',
    method: 'post',
    data
  })
}
