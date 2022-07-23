import { pick, getId } from './index.js'

export default class GxDB {
  constructor (name) {
    this.dbName = name
    return this
  }

  open (name = this.dbName) {
    if (!this.hasDB(name)) localStorage.setItem(name, '{}')
    this.dbIns = this.getDB(name)
    return this
  }

  hasDB (name) {
    return !!localStorage.getItem(name)
  }

  getDB (name = this.dbName) {
    if (!this.hasDB(name)) throw new Error('不存在此数据库！')
    return JSON.parse(localStorage.getItem(name))
  }

  saveDB (name = this.dbName) {
    localStorage.setItem(name, JSON.stringify(this.dbIns))
    return this
  }

  hasTB (name) {
    return Reflect.has(this.dbIns, name)
  }

  getTB (name) {
    return Reflect.get(this.dbIns, name)
  }

  getTBData (name) {
    return this.getTB(name).data
  }

  createTB (name, { key, incmt }, data) {
    if (!this.hasTB(name)) {
      Reflect.set(this.dbIns, name, { key, incmt, data: [] })
      data = Array.isArray(data) ? data : [data]
      data.forEach(row => this.add(name, row))
    }
    this.saveDB()
    return this
  }

  clearTB (name) {
    if (!this.hasTB(name)) throw new Error('未找到对应的表！')
    this.getTBData(name).splice(0)
    return this
  }

  deleteTB (name) {
    if (this.hasTB(name)) Reflect.deleteProperty(this.dbIns, name)
    this.saveDB()
    return this
  }

  add (name, row) {
    if (!this.hasTB(name)) throw new Error('未找到对应的表！')
    const { key, incmt } = this.getTB(name)
    if (incmt && key) Reflect.set(row, key, getId())
    this.getTBData(name).unshift(row)
    this.saveDB()
    return this
  }

  delete (name, id) {
    if (!this.hasTB(name)) throw new Error('未找到对应的表！')
    const { key } = this.getTB(name)
    const result = this.getTBData(name).filter(item => {
      if (Array.isArray(id)) {
        return !id.includes(item[key])
      } else {
        return item[key] !== id
      }
    })
    Reflect.set(this.getTB(name), 'data', result)
    this.saveDB()
    return this
  }

  put (name, id, row) {
    if (!this.hasTB(name)) throw new Error('未找到对应的表！')
    const { key } = this.getTB(name)
    const result = this.getTBData(name).map(item => {
      if (item[key] === id) {
        const record = this.select(name, every => every.id === item.id)[0]
        item = Object.assign(record, row)
      }
      return item
    })
    Reflect.set(this.getTB(name), 'data', result)
    this.saveDB()
    return this
  }

  select (name, ...args) {
    if (!this.hasTB(name)) throw new Error('未找到对应的表！')
    const fields = typeof args[0] === 'function' ? null : args[0]
    const where = typeof args[0] === 'function' ? args[0] : args[1]
    const result = this.getTBData(name).filter(item => !where || where(item))
    return result.map(item => pick(item, fields))
  }

  some (name, ...args) {
    const resut = this.select(name, ...args)
    return resut && resut.length
  }

  selectOne (name, ...args) {
    const result = this.select(name, ...args)
    return (result && result.length > 0) ? result[0] : {}
  }
}
