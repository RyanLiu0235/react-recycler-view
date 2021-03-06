import React, { Component } from "react"
import List from "./List"

class App extends Component {
  constructor() {
    super()
    this.state = {
      items: Array(50)
        .fill("grid")
        .map((item, index) => ({
          content: `${item} - ${index + 1}`,
          index
        })),
      page: 0
    }

    this.loadMoreRows = this.loadMoreRows.bind(this)
    this.fetch = this.fetch.bind(this)
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

  loadMoreRows() {
    return this.fetch().then(data => {
      const { items, page } = this.state
      this.setState({
        page: page + 1,
        items: [...items, ...data]
      })
      Promise.resolve()
    })
  }

  fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.generateItems(this.state.page + 1))
      }, 1000)
    })
  }

  render() {
    const { items } = this.state
    const rowRenderer = ({ key, index, style }) => {
      return (
        <div className="item" key={key} style={style}>
          {items[index].content}
        </div>
      )
    }
    return (
      <div className="App">
        <h1>react recycler view</h1>
        <List
          rowHeight={40}
          overscan={2}
          rowCount={items.length}
          rowRenderer={rowRenderer}
          loadMoreRows={this.loadMoreRows}
        />
      </div>
    )
  }
}

export default App
