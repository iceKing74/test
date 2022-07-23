import db from './db.js'
import { mock } from 'mockjs'
import { orderBy } from '../utils/index.js'

// POST 产品列表
mock('product/list', 'post', (payload) => {
  const { page, pageSize, state, keyword } = JSON.parse(payload.body)
  const data = db.select('product')
  const searchData = data.filter(item => {
    return (state ? item.state === state : true) &&
      (keyword ? item.title.includes(keyword) : true)
  })
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pageData = searchData.slice(start, end)
  return {
    err: 0,
    desc: '执行成功！',
    info: {
      result: pageData,
      pageCount: searchData.length
    }
  }
})

// POST 添加用户
mock('product/add', 'post', (payload) => {
  const { username, nickname } = JSON.parse(payload.body)
  db.add('product', { username, nickname })
  return { err: 0, desc: '执行成功！' }
})

// PATCH 产品修改状态
mock('product/state', 'patch', (payload) => {
  const { id, state } = JSON.parse(payload.body)
  console.log(id, state)
  return {
    err: 0,
    desc: '执行成功',
    result: db.put('product', id, { state })
  }
})

// POST 产品删除
mock('product/remove', 'post', (payload) => {
  const { ids } = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.delete('product', ids)
  }
})

// POST 产品增加
mock('product/add', 'post', (payload) => {
  const form = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.add('product', form)
  }
})

// POST 产品修改
mock('product/edit', 'post', (payload) => {
  const { id, ...others } = JSON.parse(payload.body)
  return {
    err: 0,
    desc: '执行成功!',
    result: db.put('product', id, others)
  }
})

// POST 产品分类管理
mock('productcate/allist', 'get', () => {
  return {
    err: 0,
    desc: '执行成功！',
    result: orderBy(db.select('productcate', item => item.state === 2))
  }
})
