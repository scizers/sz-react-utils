import React, { Component } from 'react'
import {
  Table,
  Input, Button, Icon
} from 'antd'
import _ from 'lodash'
import Highlighter from 'react-highlight-words'
import memoizeOne from 'memoize-one'
import S from 'string'

class TableComp extends Component {

  state = {
    data: [],
    columns: [],
    pagination: {},
    loading: true,
    searchText: '',
    dataSearchParams: {}
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch2({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  fetch = async (params = {}) => {

    this.setState({
      loading: true,
      dataSearchParams: params
    })

    let data = await this.props.apiRequest({ ...params })

    let pagination = { ...this.state.pagination }
    pagination.total = data.total
    this.setState({
      loading: false,
      data: data.data,
      pagination
    })

  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: (pro) => {
      let {
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      } = pro

      return (<div className={{
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, .15)'
      }
      }>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>)
    },
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }}/>,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: (text) => {
      return (
        <React.Fragment>
          {!!text ? (<Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />) : null}
        </React.Fragment>
      )
    }
  })
  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }
  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  reload = () => {
    this.fetch(this.state.dataSearchParams)
  }

  setDataState = async () => {


  }

  constructor (props) {
    super(props)
    this.fetch2 = memoizeOne(this.fetch)
    // this.fetch2 = (this.fetch)
  }

  componentDidMount () {

    let x = []
    _.each(this.props.columns, (i) => {


      if (i.searchTextName) {
        i = { ...this.getColumnSearchProps(i.searchTextName), ...i }
      }

      if (i.dataIndex === undefined && i.key !== 'actions' && i.type !== 'actions') {
        i.dataIndex = i.key
      }

      if (i.title === undefined) {
        i.title = S(i.dataIndex).humanize().titleCase().s
      }
      x.push(i)

    })

    this.setState({
      columns: x
    })

    this.fetch2()
  }

  render () {
    const { columns } = this.state
    const { extraProps, reloadButon } = this.props

    return (
      <React.Fragment>

        <div>
          {reloadButon ?
            <Button
              shape="circle" onClick={() => {
              this.reload()
            }} icon="reload"/> : null}
        </div>

        <Table
          bordered
          {...extraProps}
          columns={columns}
          rowKey={record => record._id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          loading={this.state.loading}
        />
      </React.Fragment>
    )

  }
}

export default TableComp
