import React, { PureComponent } from "react"
import { number, func } from "prop-types"

export default class List extends PureComponent {
  constructor() {
    super()
    this.state = {
      isLoaded: true,
      startIndex: 0,
      stopIndex: 1
    }

    this.scrollHandler = this.scrollHandler.bind(this)
  }

  static propTypes = {
    rowHeight: number.isRequired,
    overscan: number,
    rowCount: number.isRequired,
    rowRenderer: func.isRequired,
    loadMoreRows: func.isRequired
  }

  static defaultProps = {
    rowCount: 2
  }

  componentDidMount() {
    this.calculateRange()
  }

  calculateRange() {
    const { list, container } = this.refs
    const { overscan, rowCount, rowHeight, loadMoreRows } = this.props

    const { height: containerHeight } = container.getBoundingClientRect()
    const { top: containerTop } = container.getBoundingClientRect()
    const { top: listTop } = list.getBoundingClientRect()

    // 被卷去的个数
    const count = Math.floor(Math.abs(listTop - containerTop) / rowHeight)
    // 屏幕中可以容纳的items的个数
    const visibles = Math.ceil(containerHeight / rowHeight)
    const startIndex = count >= overscan ? count - overscan : count
    const stopIndex = Math.min(
      rowCount - 1, // 防止stopIndex超过目前items个数
      rowCount >= count + visibles + overscan
        ? count + visibles + overscan
        : count + visibles
    )

    this.setState({ startIndex, stopIndex }, () => {
      if (
        stopIndex === rowCount - 1 && // 是否最后一个已经露出
        this.state.isLoaded // 是否上一次已经加载成功
      ) {
        this.setState({ isLoaded: false })
        loadMoreRows().then(() => {
          this.setState({
            isLoaded: true
          })
        })
      }
    })
  }

  scrollHandler() {
    this.calculateRange()
  }

  render() {
    const { startIndex, stopIndex, isLoaded } = this.state
    const { rowRenderer, rowCount, rowHeight, overscan } = this.props
    const list = []
    for (let i = startIndex; i <= stopIndex; i++) {
      const style = {
        top: i * rowHeight + "px"
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
              height: rowCount * rowHeight + 2 + "px"
            }}
            ref="list"
          >
            {list}
          </div>
        </div>
        <div className="dashboard">
          <p>总共数量：{rowCount}个</p>
          <p>当前渲染：{`${startIndex + 1} - ${stopIndex + 1}`}</p>
          <p>预先加载：{overscan}个</p>
          <p>{isLoaded ? "加载成功" : "加载中..."}</p>
        </div>
      </div>
    )
  }
}
