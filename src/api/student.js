import request from '@/utils/request'

export function fetchList(params) {
  console.log('api')
  return request({
    url: '/vue-admin-template/student/list',
    method: 'get',
    params: params
  })
}

export function fetchStudent(id) {
  return request({
    url: 'vue-admin-template/student/detail',
    method: 'get',
    params: { id }
  })
}

export function createStudent(data) {
  return request({
    url: '/vue-admin-template/student/create',
    method: 'post',
    data
  })
}

export function updateStudent(data) {
  return request({
    url: '/vue-admin-template/student/update',
    method: 'post',
    data
  })
}