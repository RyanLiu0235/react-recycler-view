import React, { PureComponent } from "react"

export default class List extends PureComponent {
  constructor() {
    super()
    this.state = {
      startIndex: 0,
      stopIndex: 1
    }

    this.scrollHandler = this.scrollHandler.bind(this)
  }

  componentDidMount() {
    this.setItem()
  }

  setItem() {
    const { list, container } = this.refs
    const { overscan, rowCount, rowHeight } = this.props

    const { height: containerHeight } = container.getBoundingClientRect()
    const { top: containerTop } = container.getBoundingClientRect()
    const { top: listTop } = list.getBoundingClientRect()

    // 被卷去的个数
    const count = Math.floor(Math.abs(listTop - containerTop) / rowHeight)
    // 屏幕中可以容纳的items的个数
    const visibles = Math.ceil(containerHeight / rowHeight)
    this.setState({
      startIndex: count >= overscan ? count - overscan : count,
      stopIndex: Math.min(
        rowCount - 1, // 防止stopIndex超过目前items个数
        rowCount >= count + visibles + overscan
          ? count + visibles + overscan
          : count + visibles
      )
    })
  }

  scrollHandler() {
    this.setItem()
  }

  render() {
    const { startIndex, stopIndex } = this.state
    const { rowRenderer, loadMore, rowCount, overscan } = this.props
    const list = []
    for (let i = startIndex; i <= stopIndex; i++) {
      const style = {
        top: i * 40 + "px"
      }
      list.push(
        this.props.rowRenderer({
          key: i,
          style,
          index: i
        })
      )
    }

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
              height: (rowCount + 1) * 40 + 2 + "px"
            }}
            ref="list"
          >
            {list}
            <div
              className="item"
              onClick={loadMore}
              style={{
                top: rowCount * 40 + "px"
              }}
            >
              load more
            </div>
          </div>
        </div>
        <div className="dashboard">
          <p>总共数量：{rowCount}个</p>
          <p>当前渲染：{`${startIndex + 1} - ${stopIndex + 1}`}</p>
          <p>预先加载：{overscan}个</p>
        </div>
      </div>
    )
  }
}
