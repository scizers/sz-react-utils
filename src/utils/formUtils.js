import moment from 'moment'
import React, {Component, PureComponent} from 'react'

import {Form, Input, Upload, Icon, Button, InputNumber, Select, DatePicker, Spin, Switch} from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option
const {TextArea} = Input

const styles = {
  mainDiv: {
    position: 'relative'
  },
  loadingBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255,255, 0.5)',
    textAlign: 'center',
    paddingTop: '10%'

  }
}

class SimpleFormElement extends PureComponent {

  state = {
    tempFiles: []
  }

  handlePreview = (file) => {
    console.log(file)
  }

  handleChange = (v) => {


    console.log(v)

  }

  section = (type) => {

    let x = this.props
    let {item, apiUrl } = this.props

    switch (type) {
      case 'number':
        return <InputNumber {...x} />

      case 'date':
        return <DatePicker {...x} />

      case 'textArea':
        return <TextArea {...x} rows={x.rows}/>

      case 'file':

        let limit = 1
        if (!!item.limit) limit = item.limit

        let {fileUploads, item: {key}} = x

        let uploadEnable = true
        if (fileUploads[key] !== undefined) {
          if (fileUploads[key].length >= limit) {
            uploadEnable = false
          }
        }

        return (
          <Upload
            name={'file'}
            action={`${apiUrl}/filesUploader`}
            defaultFileList={item.defaultFileList}
            showUploadList={true}
            {...x}
          >
            {uploadEnable ? (
              <Button>
                <Icon type='upload'/> Select File
              </Button>
            ) : null}

          </Upload>
        )

      case 'switch':
        let extra = {
          defaultChecked: !!item.defaultValue,
          size: item.size !== undefined ? item.size : 'small'
        }
        return <Switch {...extra} {...x}/>

      case 'select':
        if (!x.options) x.options = []
        if (!x.item.defaultValue) x.item.defaultValue = {'key': 'Please Select'}
        return <SelectMy {...x}/>

      default:
        return <Input trigger={'onBlur'} {...x} />
    }
  }

  render () {
    const {item} = this.props
    const {type} = item
    return (
      <React.Fragment>
        {this.section(type)}
      </React.Fragment>
    )
  }

}

class SelectMy extends PureComponent {
  render () {

    let x = this.props

    return (<Select {...x}>
      {
        x.item.options.map((val, index) => {
          if (typeof val == 'object') {
            return (
              <Option key={index} value={val.id}>{val.display}</Option>
            )
          } else {
            return (
              <Option key={index} value={val}>{val}</Option>
            )
          }

        })
      }
    </Select>)

    /*return (<Select>

      <Option key={moment().unix()} value={'dd'}>test</Option>

    </Select>)*/

  }
}

class SelectAsync extends PureComponent {
  render () {
    const options = this.state.data.map(d => (
      <Option key={d.value}>{d.text}</Option>
    ))
    return (
      <Select
        showSearch
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={true}
        filterOption={true}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    )
  }

}

class getAllFormFields extends PureComponent {

  state = {
    fileUploads: []
  }

  normFile = (e, name) => {
    if (Array.isArray(e)) {
      return e
    }
    let fileUploads = this.state.fileUploads
    fileUploads[name] = e.fileList
    this.setState({fileUploads})

    return e && e.fileList
  }

  constructor (props) {
    super(props)

  }

  render () {

    const {inputSchema, getFieldDecorator, children, formItemLayout, apiUrl} = this.props

    let FIL = {}

    if (!formItemLayout) {
      FIL = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 8},
          md: {span: 8}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
          md: {span: 12}
        }
      }
    } else {
      FIL = formItemLayout
    }

    return (
      <div style={styles.mainDiv}>


        {inputSchema.fields.map((item) => {

          let rules = []
          if (item.required) {
            rules.push({
              required: true,
              message: item.requiredMessage ? item.requiredMessage : 'This is a Mandatory Field'
            })
          }

          let customEvent = {}
          if (item.customDirectives) {
            customEvent = item.customDirectives
          }


          let inputProps = {}

          if (!!item.placeholder) inputProps.placeholder = item.placeholder
          if (!!apiUrl) inputProps.apiUrl = apiUrl

          if (!!item.options) {
            inputProps.options = item.options
          } else {
            inputProps.options = ['Choose']
          }


          if (!!item.type) inputProps.type = item.type
          if (!!item.rows) inputProps.rows = item.rows

          if (item.type === 'file') {
            customEvent = {
              ...customEvent,
              getValueFromEvent: (e) => {
                // console.log(item)
                return this.normFile(e, item.key)
              }
            }

            inputProps = {
              ...inputProps,
              fileUploads: this.state.fileUploads,
              trigger: 'onBlur'
            }
          }

          return (
            <React.Fragment key={item.key}>

              {item.prefixComp ? item.prefixComp : null}

              <FormItem {...FIL}
                        key={item.key}
                        label={item.label}>

                {getFieldDecorator(item.key, {rules, ...customEvent})(
                  <SimpleFormElement item={item} {...inputProps}/>)}

              </FormItem>


            </React.Fragment>
          )

        })}

        {children}

        {this.props.loading ? (<div style={styles.loadingBox}>
          <Spin size="large"/>
        </div>) : null}

      </div>
    )

  }

}

export default (getAllFormFields)
