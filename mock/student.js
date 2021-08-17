const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [
    {
      id: '@id',
      'name': '@cname',
      'sex|1': ['male', 'female'],
      'birthday': '@date',
      pageviews: '@integer(300, 5000)'
    }
  ]
})

module.exports = [
  {
    url: '/vue-admin-template/student/list',
    type: 'get',
    response: config => {
      const { sex, name, page = 1, limit = 20, sort } = config.query

      let mockList = data.items.filter(item => {
        if (sex && item.sex !== sex) return false
        if (name && item.name.indexOf(name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      )

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-admin-template/student/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const student of data.items) {
        if (student.id === +id) {
          return {
            code: 20000,
            data: student
          }
        }
      }
    }
  },
  {
    url: '/vue-admin-template/student/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/student/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/student/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]