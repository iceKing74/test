import db from './db.js'
import { mock } from 'mockjs'
import { orderBy } from '../utils/index.js'

// 轮播列表
mock('carousel/list', 'get', () => {
  return {
    err: 0,
    desc: '执行成功！',
    result: orderBy(db.select('carousel'))
  }
})

// POST 添加用户
mock('carousel/add', 'post', (payload) => {
  const { username, nickname } = JSON.parse(payload.body)
  db.add('carousel', { username, nickname })
  return { err: 0, desc: '执行成功！' }
})

// PATCH 轮播修改状态
mock('carousel/state', 'patch', (payload) => {
  const { id, state } = JSON.parse(payload.body)
  console.log(id, state)
  return {
    err: 0,
    desc: '执行成功',
    result: db.put('carousel', id, { state })
  }
})

// POST 轮播删除
mock('carousel/remove', 'post', (payload) => {
  const { ids } = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.delete('carousel', ids)
  }
})

// POST 轮播增加
mock('carousel/add', 'post', (payload) => {
  const form = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.add('carousel', form)
  }
})

// POST 轮播修改
mock('carousel/edit', 'post', (payload) => {
  const { id, ...others } = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.put('carousel', id, others)
  }
})
