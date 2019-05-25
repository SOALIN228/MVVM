fakeDate()

function Model (option) {
  this.data = option.data
  this.resouce = option.resouce
}

Model.prototype.fetch = function (id) {
  return axios.get(`/${this.resouce}/${id}`).then((response) => {
    this.data = response.data
  })
}

Model.prototype.update = function (data) {
  let id = this.data.id
  return axios.put(`/${this.resouce}/${id}`, data).then((response) => {
    this.data = response.data
  })
}

let model = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  resouce: 'books'
})

let view = new Vue({
  el: '#app',
  data: {
    book: {
      name: 'JS高级程序设计',
      number: 2,
      id: 1
    }
  },
  template: `
  <div>
    <div>
      书名：《{{book.name}}》 数量：
      <span id="number">{{book.number}}</span>
    </div>
    <button id="addOne" @click="addOne">加1</button>
    <button id="minusOne" @click="minusOne">减1</button>
    <button id="reset" @click="reset">归零</button>
  </div>
  `,
  created(){
    model.fetch(1).then(() => {
      this.book = model.data
    })
  },
  methods: {
    addOne () {
      model.update({ number: this.book.number + 1 }).then(() => {
        this.book = model.data
      })
    },
    minusOne () {
      model.update({ number: this.book.number - 1 }).then(() => {
        this.book = model.data
      })
    },
    reset () {
      model.update({ number: 0 }).then(() => {
        this.book = model.data
      })
    }
  }
})

let controller = {
  init (options) {
    let { view, model } = options
    this.view = view
    this.model = model
  }
}

controller.init({ view: view, model: model })

// 模拟的后台
function fakeDate () {
  let book = { // 伪数据库
    name: 'JS高级程序设计',
    number: 2,
    id: 1
  }

  axios.interceptors.response.use(function (response) { // 监听响应
    let { config: { method, url, data } } = response
    if (url === '/books/1' && method === 'get') {
      response.data = book
    } else if (url === '/books/1' && method === 'put') {
      data = JSON.parse(data)
      Object.assign(book, data) // 替换book中和data不同的值
      response.data = book
    }
    return response
  })
}
