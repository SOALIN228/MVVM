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
    return response
  })
}

function View ({ el, template }) {
  this.el = el
  this.template = template
}

View.prototype.render = function (data) {
  let html = this.template
  for (let key in data) {
    html = html.replace(`__${key}__`, data[key])
  }
  $(this.el).html(html)
}

let model = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  resouce: 'books'
})

let view = new View({
  el: '#app',
  template: `
  <div>
    书名：《__name__》 数量：
    <span id="number">__number__</span>
  </div>
  <button id="addOne">加1</button>
  <button id="minusOne">减1</button>
  <button id="reset">归零</button>
  `
})

let controller = {
  init (options) {
    let { view, model } = options
    this.view = view
    this.model = model
    this.view.render(this.model.data)
    this.bindEvents()
    this.model.fetch(1).then(() => {
      this.view.render(this.model.data)
    })
  },
  addOne () {
    let oldNumber = $('#number').text()
    let newNumber = oldNumber - 0 + 1 // str转成num并加1
    this.model.update({ number: newNumber }).then(() => {
      this.view.render(model.data)
    })
  },
  minusOne () {
    let oldNumber = $('#number').text()
    let newNumber = oldNumber - 0 - 1 // str转成num并减1
    this.model.update({ number: newNumber }).then(() => {
      this.view.render(model.data)
    })
  },
  reset () {
    this.model.update({ number: 0 }).then(() => {
      this.view.render(model.data)
    })
  },
  bindEvents () {
    $(this.view.el).on('click', '#addOne', this.addOne.bind(this))
    $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this))
    $(this.view.el).on('click', '#reset', this.reset.bind(this))
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
