import request from '@/utils/request'

export function getAssayIndexWrapperPage(data) {
  return request({
    url: '/basics/assay/assayIndex/getAssayIndexWrapperPage',
    method: 'post',
    data
  })
}

export function addAssayIndex(data) {
  return request({
    url: '/basics/assay/assayIndex/addAssayIndex',
    method: 'post',
    data
  })
}

export function updateAssayIndex(data) {
  return request({
    url: '/basics/assay/assayIndex/updateAssayIndex',
    method: 'post',
    data
  })
}

export function deleteAssayIndex(data) {
  return request({
    url: '/basics/assay/assayIndex/deleteAssayIndex',
    method: 'post',
    data
  })
}
