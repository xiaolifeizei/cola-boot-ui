import request from '@/utils/request'

export function getTransitCompanyPage(data) {
  return request({
    url: '/basics/transitCompany/getTransitCompanyPage',
    method: 'post',
    data
  })
}

export function addTransitCompany(data) {
  return request({
    url: '/basics/transitCompany/addTransitCompany',
    method: 'post',
    data
  })
}

export function updateTransitCompany(data) {
  return request({
    url: '/basics/transitCompany/updateTransitCompany',
    method: 'post',
    data
  })
}

export function deleteTransitCompany(data) {
  return request({
    url: '/basics/transitCompany/deleteTransitCompany',
    method: 'post',
    data
  })
}
