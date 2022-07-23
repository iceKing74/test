import GxDB from '../utils/GxDB'

// 导入md5加密
import md5 from 'js-md5'

// 创建一个数据库实例
const db = new GxDB('vivodb').open()

// 创建admin incmt自动增长
db.createTB(
  'admin',
  { key: 'id', incmt: true },
  {
    avatar: require('../assets/img/tx.png'),
    username: 'admin',
    nickname: '小小',
    mobile: '177770836777',
    password: md5('123456'),
    gender: 1,
    role: 1,
    state: 2,
    pubdate: 12847328222134
  }
)

// 用户数据表
db.createTB(
  'user',
  { key: 'id', incmt: true },
  {
    avatar: require('@/assets/img/tx2.jpg'),
    username: 'admin',
    nickname: '龚贤',
    mobile: '19911213131',
    password: md5('000000'),
    gender: 1,
    role: 1,
    state: 2,
    pubdate: 12847328222134
  }
)

// 轮播数据表
db.createTB(
  'carousel',
  { key: 'id', incmt: true },
  [{
    orderid: 1,
    title: '网易',
    thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    url: 'www.163.com',
    pubdate: 47328222134,
    state: 2
  },
  {
    orderid: 2,
    title: '百度',
    thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    url: 'www.baidu.com',
    pubdate: 57328222134,
    state: 1
  },
  {
    orderid: 3,
    title: '凤凰',
    thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    url: 'www.ifeng.com',
    pubdate: 67328222134,
    state: 1
  }]
)

db.createTB(
  'productcate',
  { key: 'id', incmt: true },
  [
    {
      title: '类别名称_1',
      thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      orderid: 1,
      state: 1
    },
    {
      title: '类别名称_2',
      thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      orderid: 2,
      state: 2
    },
    {
      title: '类别名称_3',
      thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      orderid: 3,
      state: 1
    }
  ]
)

// 创建product
db.createTB(
  'product',
  { key: 'id', incmt: true },
  [
    {
      pid: 0,
      title: '标题1',
      summary: '产品摘要1',
      price: 999,
      thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      viewurl: '',
      total: 999,
      content: '产品内容1',
      state: 2,
      pubdate: 1230000909090
    },
    {
      pid: 0,
      title: '标题2',
      summary: '产品摘要2',
      price: 999,
      thumb: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      viewurl: '',
      total: 999,
      content: '产品内容2',
      state: 2,
      pubdate: 1230000909090
    }
  ]
)

// 导出数据库实例
export default db
