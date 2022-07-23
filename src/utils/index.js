export function getPath () {
  return location.hash.match(/(?:#|\/)(\w+)$/)[1]
}

export function getLocalTabs () {
  const vivoTabs = localStorage.getItem('vivo_tabs')
  return vivoTabs ? JSON.parse(vivoTabs) : [{ name: 'dashboard', label: '首页管理' }]
}

export function getId () {
  return Date.now() + Math.round(Math.random() * (99999 - 10000) + 10000).toString()
}

export function pick (obj, value) {
  const result = {}
  const fields = Array.isArray(value) ? value : [value]
  const keys = Reflect.ownKeys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!value || fields.includes(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

export const orderBy = (data, field = 'orderid') => {
  if (!data.every(item => item[field])) return data
  return data.sort((prev, next) => prev[field] - next[field])
}
