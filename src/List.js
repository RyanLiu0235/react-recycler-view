import React, { Component } from "react"

export default class List extends Component {
  constructor() {
    super()
    this.state = {
      items: Array(50)
        .fill("grid")
        .map((item, index) => ({
          content: `${item} - ${index + 1}`,
          index
        })),
      available: [],
      page: 0,
      overscan: 2
    }

    this.scrollHandler = this.scrollHandler.bind(this)
    this.loadMoreHandler = this.loadMoreHandler.bind(this)
    this.fetch = this.fetch.bind(this)
  }

  componentDidMount() {
    this.setItem()
  }

  generateItems(page) {
    const ps = 50
    return Array(ps)
      .fill("grid")
      .map((item, index) => ({
        content: `${item} - ${index + page * ps + 1}`,
        index: index + page * ps
      }))
  }

  setItem() {
    const containerHeight = 400
    const rowHeight = 40

    const { list, container } = this.refs

    const { top: containerTop } = container.getBoundingClientRect()
    const { top: listTop } = list.getBoundingClientRect()
    const count = Math.floor(Math.abs(listTop - containerTop) / rowHeight)
    const overscan = this.state.overscan
    this.setState({
      available: this.state.items.slice(
        count >= overscan ? count - overscan : count,
        this.state.items.length >= count + 10 + overscan
          ? count + 10 + overscan
          : count + 10
      )
    })
  }

  scrollHandler() {
    this.setItem()
  }

  loadMoreHandler() {
    this.fetch().then(items => {
      this.setState({
        items
      })
      this.setItem()
    })
  }

  fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { items, page } = this.state
        resolve([...items, ...this.generateItems(page + 1)])
        this.setState({
          page: page + 1
        })
      }, 1000)
    })
  }

  render() {
    const { items, overscan, available } = this.state
    const list = this.state.available.map((item, index) => {
      const style = {
        top: item.index * 40 + "px"
      }
      return (
        <div className="item" key={item.index} index={item.index} style={style}>
          {item.content}
        </div>
      )
    })
    const visibleRange = (function() {
      const length = available.length
      if (length === 0) return "无"
      return `${available[0].index + 1} - ${available[length - 1].index + 1}`
    })()
    return (
      <div className="wrapper">
        <div
          className="container"
          ref="container"
          onScroll={this.scrollHandler}
        >
          <div
            className="list"
            style={{
              height: (items.length + 1) * 40 + 2 + "px"
            }}
            ref="list"
          >
            {list}
            <div
              className="item"
              onClick={this.loadMoreHandler}
              style={{
                top: items.length * 40 + "px"
              }}
            >
              load more
            </div>
          </div>
        </div>
        <div className="dashboard">
          <p>总共数量：{items.length}个</p>
          <p>当前渲染：{visibleRange}</p>
          <p>预先加载：{overscan}个</p>
        </div>
      </div>
    )
  }
}
