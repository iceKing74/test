// 导入数据库
import db from './db'

// 导入md5加密
import md5 from 'js-md5'

// 导入token
import jwt from 'jsonwebtoken'

import { mock } from 'mockjs'

import { pick } from '../utils/index.js'

// 验证登入
mock('admin/login', 'post', (payload) => {
  console.log(payload)
  const { username, password } = JSON.parse(payload.body)

  // 验证 管理员 当前 状态信息
  const stateResult = db.some('admin', item => item.username === username && item.state === 1)
  if (stateResult) return { err: 0, desc: '你的用户尚未审核！' }

  // 核对密码
  const loginResult = db.some('admin', item => {
    return item.username === username &&
           item.password === md5(password)
  })

  // 说明此用户存在
  if (loginResult) {
    let token = ''
    try {
      // 登入成功颁发授权码 token
      // expriseIn 过去时间 1d/1h/1s 一天/一小时/一秒
      token = jwt.sign({ data: username }, '1314', { expiresIn: '1d' })
    } catch (err) {
      console.error(err)
    }
    return { err: 0, token, desc: '登入成功' }
  } else {
    return { err: 10001, desc: '用户名或者密码错误' }
  }
})

mock('admin/info', 'get', () => {
  const token = localStorage.getItem('XX-Token')
  try {
    const { data: username } = jwt.verify(token, '1314')
    const result = pick(db.selectOne('admin', item => item.username === username), ['avatar', 'username', 'nickname'])
    return {
      err: 0,
      desc: '执行成功',
      result: result
    }
  } catch (err) {
    console.log(err)
  }
})

// 用户列表
mock('admin/list', 'get', () => {
  return {
    err: 0,
    desc: '执行成功！',
    result: db.select('admin')
  }
})

// POST 添加用户
mock('admin/add', 'post', (payload) => {
  const { username, nickname } = JSON.parse(payload.body)
  db.add('admin', { username, nickname })
  return { err: 0, desc: '执行成功！' }
})

// PATCH 用户修改状态
mock('admin/state', 'patch', (payload) => {
  const { id, state } = JSON.parse(payload.body)
  console.log(id, state)
  return {
    err: 0,
    desc: '执行成功',
    result: db.put('admin', id, { state })
  }
})

// POST 用户删除
mock('admin/remove', 'post', (payload) => {
  const { ids } = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.delete('admin', ids)
  }
})

// POST 用户增加
mock('admin/add', 'post', (payload) => {
  const { password, ...form } = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功！',
    result: db.add('admin', { ...form, password: md5(password) })
  }
})

// POST 用户修改
mock('admin/edit', 'post', (payload) => {
  const { id, password, ...form } = JSON.parse(payload.body)
  console.log(id)
  return {
    err: 0,
    desc: '执行成功！',
    result: db.put('admin', id, Object.assign(form, password ? { password: md5(password) } : false))
  }
})
