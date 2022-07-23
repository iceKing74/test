import db from './db'
// import Mock from 'mockjs'
import { mock } from 'mockjs'

// const { mock } = Mock

// 用户列表
mock('user/list', 'get', () => {
  return {
    err: 0,
    desc: '执行成功！',
    result: db.select('user')
  }
  // return Mock.mock({
  //   error: 0,
  //   desc: '查询成功！',
  //   'result|5-20': [{
  //     'id|+1': 1,
  //     truename: () => Random.name()
  //   }]
  // })
})

// POST 添加用户
mock('user/add', 'post', (payload) => {
  console.log(payload)
  const { username, nickname } = JSON.parse(payload.body)
  db.add('gx_user', { username, nickname })

  return { err: 0, desc: '执行成功！' }
})
