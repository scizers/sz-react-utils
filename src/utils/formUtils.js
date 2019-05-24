import moment from 'moment'
import React, { Component, PureComponent } from 'react'

import ReactQuill from 'react-quill' // ES6
import 'react-quill/dist/quill.snow.css' // ES6
import 'react-quill/dist/quill.bubble.css' // ES6

import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import { Form, Input, Upload, Icon, Button, InputNumber, Select, DatePicker, Spin, Switch, Radio } from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'
import S from 'string'

const RadioGroup = Radio.Group

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

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

class SimpleFormElement extends Component {

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
    let { item, apiurl } = this.props

    switch (type) {
      case 'number':
        return <InputNumber {...x} />

      case 'date':
        return <DatePicker {...x} format={item.format}/>

      case 'textarea':
      case 'textArea':
        return <TextArea {...x} rows={x.rows}/>

      case 'editor':
        return <ReactQuill  {...x} />

      case 'ckeditor':
        return <CKEditor
          editor={ClassicEditor}
          {...x}
        />

      case 'file':

        let limit = 1
        if (!!item.limit) limit = item.limit

        let { fileUploads, item: { key } } = x

        let uploadEnable = true
        if (fileUploads[key] !== undefined) {
          if (fileUploads[key].length >= limit) {
            uploadEnable = false
          }
        }

        return (
          <Upload
            name={'file'}
            action={`${apiurl}/filesUploader`}
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
        if (!x.item.defaultValue) x.item.defaultValue = { 'key': 'Please Select' }
        return <SelectDynamicComp {...x}/>

      case 'radioGroup':
        if (!x.options) x.options = []
        //if (!x.item.defaultValue) x.item.defaultValue = { 'key': 'Please Select' }
        return <RadioGroup options={x.options} onChange={x.item.onChange}/>


      default:
        return <Input trigger={'onBlur'} {...x} />
    }
  }

  render () {
    const { item } = this.props

    const { type } = item
    return (
      <React.Fragment>
        {this.section(type)}
      </React.Fragment>
    )
  }

}

class SelectDynamicComp extends Component {
  render () {

    let x = this.props

    if (!x.item.showSearch) x.item.showSearch = false
    if (!x.item.disabled) x.item.disabled = false
    let options = x.item.options

    let keyAccessor = x.keyAccessor ? x.keyAccessor : val => val.id ? val.id : val._id
    let valueAccessor = x.valueAccessor ? x.valueAccessor : val => val.display

    return (<Select {...x}
                    showSearch={x.item.showSearch}
                    onChange={x.item.onChange}
                    disabled={x.item.disabled}
                    filterOption={(input, option) => {
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}>


      {options.map((val, index) => {
        if (typeof val === 'object') {
          return (
            <Option key={index} value={keyAccessor(val)}>{valueAccessor(val)}</Option>
          )
        } else {
          return (
            <Option key={index} value={val}>{val}</Option>
          )
        }

      })}
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

class getAllFormFields extends Component {

  state = {
    fileUploads: []
  }

  normFile = (e, name) => {
    if (Array.isArray(e)) {
      return e
    }
    let fileUploads = this.state.fileUploads
    fileUploads[name] = e.fileList
    this.setState({ fileUploads })
    return e && e.fileList
  }

  constructor (props) {
    super(props)

  }

  updateUploadState = (key) => {

    const { getFieldValue } = this.props

    if (!getFieldValue) return false

    let xx = getFieldValue(key)

    if (xx) {
      let fileUploads = this.state.fileUploads

      if (!_.isEqual(xx, fileUploads[key])) {
        fileUploads[key] = xx

        setTimeout(() => {
          this.setState({ fileUploads })
        }, 30)

      }

    }
  }

  render () {

    const { inputSchema, getFieldDecorator, children, formItemLayout, apiurl } = this.props

    let FIL = {}

    if (!formItemLayout) {
      FIL = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
          md: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 12 }
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

          if (item.label === undefined) {
            item.label = S(item.key).humanize().titleCase().s
          }

          let customEvent = {}
          if (item.customDirectives) {
            customEvent = item.customDirectives
          }


          let inputProps = {}

          if (!!item.placeholder) inputProps.placeholder = item.placeholder
          if (!!apiurl) inputProps.apiurl = apiurl

          if (!!item.options) {
            inputProps.options = item.options
          } else {
            inputProps.options = ['Choose']
          }

          if (!!item.type) inputProps.type = item.type
          if (!!item.mode) inputProps.mode = item.mode
          if (!!item.rows) inputProps.rows = item.rows
          if (!!item.keyAccessor) inputProps.keyAccessor = item.keyAccessor
          if (!!item.valueAccessor) inputProps.valueAccessor = item.valueAccessor

          if (item.type === 'file') {

            customEvent = {
              ...customEvent,
              valuePropName: 'fileList',
              getValueFromEvent: (e) => {
                return this.normFile(e, item.key)
              }
            }

            inputProps = {
              ...inputProps,
              fileUploads: this.state.fileUploads,
              trigger: 'onBlur'
            }

            this.updateUploadState(item.key)
          }

          if (item.type === 'editor') {
            customEvent = {
              ...customEvent,
              initialValue: item.initialValue ? item.initialValue : '',
              valuePropName: 'value',
              getValueFromEvent: this.onChange
            }

          }

          if (item.type === 'ckeditor') {
            customEvent = {
              ...customEvent,
              // initialValue: item.initialValue ? item.initialValue : '',
              valuePropName: 'data',
              getValueFromEvent: (event, editor) => {
                const data = editor.getData()
                return data
              }
            }

          }


          inputProps = {
            ...inputProps,
            ...item.customProps
          }

          return (
            <React.Fragment key={item.key}>

              {item.prefixComp ? item.prefixComp : null}

              <FormItem {...FIL}
                        key={item.key}
                        label={item.label}>

                {getFieldDecorator(item.key, { rules, ...customEvent })(
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
