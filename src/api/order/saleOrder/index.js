import request from '@/utils/request'

export function getSaleOrderWrapperPage(data) {
  return request({
    url: '/order/saleOrder/getSaleOrderWrapperPage',
    method: 'post',
    data
  })
}

export function getSaleSubOrderWrapperPage(data) {
  return request({
    url: '/order/saleOrder/getSaleSubOrderWrapperPage',
    method: 'post',
    data
  })
}

export function addSaleOrder(data) {
  return request({
    url: '/order/saleOrder/addSaleOrder',
    method: 'post',
    data
  })
}

export function updateSaleOrder(data) {
  return request({
    url: '/order/saleOrder/updateSaleOrder',
    method: 'post',
    data
  })
}

export function deleteSaleOrder(data) {
  return request({
    url: '/order/saleOrder/deleteSaleOrder',
    method: 'post',
    data
  })
}

export function frozenOrder(data) {
  return request({
    url: '/order/saleOrder/frozenOrder',
    method: 'post',
    data
  })
}

export function unFrozenOrder(data) {
  return request({
    url: '/order/saleOrder/unFrozenOrder',
    method: 'post',
    data
  })
}

export function frozenSubOrder(data) {
  return request({
    url: '/order/saleOrder/frozenSubOrder',
    method: 'post',
    data
  })
}

export function unFrozenSubOrder(data) {
  return request({
    url: '/order/saleOrder/unFrozenSubOrder',
    method: 'post',
    data
  })
}
