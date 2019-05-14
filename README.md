# sz-react-utils

## Handing Forms

```jsx harmony

import {FormUtils} from 'sz-react-utils';

class formExample extends Component() {
  render () {

    const formItemLayout = {
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

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
        md: {span: 12, offset: 8}
      }
    }


    const {form: {getFieldDecorator, getFieldValue, setFieldsValue}} = this.props
    let inputTypes = {
      fields: [
        {
          key: 'firstName',
          label: 'First Name' // optional
        },
        {
          key: 'gender',
          type: 'select',
          options: ['Male', 'Female', 'other', 'Prefer not to say'],
          onChange: (gender) => {
            setFieldsValue({gender})
          }
        },
        {
          key: 'makes',
          type: 'select',
          mode : 'multiple',
          placeholder: 'Enter Your Make',
          keyAccessor: x => x._id,
          valueAccessor: x => x.name,
          options: this.state.options,
          onChange: (make) => {
            setFieldsValue({make})
          }
        },
        {
          label: 'Due Date  ',
          key: 'dueDate',
          required: true,
          type: 'date',
          customProps: {
            disabledDate: d => !d || d.isBefore(moment().add(-1, 'day'))
          }
        },
        {
          key: 'desc',
          type: 'editor', // will produces a wysiwyg editor 
          placeholder: 'Enter Your Make',
          editorProps: {
            theme: 'snow',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
              ]
            },
            formats: [
              'header',
              'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet', 'indent',
              'link', 'image'
            ]
          } // react quill props - optional
        },
        {
          key: 'objectives',
          type: 'ckeditor', // will produces a ckeditor wysiwyg editor 

        },
        {
          key: 'image',
          type: 'file',
          limit: 2 // default is 1
        },
      ]
    }

    return (
      <React.Fragment>

        <FormUtils inputSchema={inputTypes}
                   formItemLayout={formItemLayout} // optional 
                   getFieldDecorator={getFieldDecorator}
        />


      </React.Fragment>
    )
  }
}

```

```jsx harmony

    const columns = [

      {
        title: 'Action',
        key: 'operation',
        dataindex: 'operation',
        width: 100,
        render: (text, record) => (<React.Fragment>
            <Tooltip title="Follow Ups">
              <Button className={styles.btn}
                      size={'small'}
                      shape="circle" onClick={() => this.openFollowUps(record)} icon="calendar"/>
            </Tooltip>
            {/* <Tooltip title="Click To Edit Details">
              <Button className={styles.btn}
                      shape="circle"
                      size={'small'}
                      onClick={() => {
                        dispatch(getUrlPushWrapper('desk.updateCousenlling', { id: record._id }))
                      }} icon="edit"/>
            </Tooltip>*/}

          </React.Fragment>
        )
      },
      {
        title: 'Photo',
        key: 'profilePic',
        dataIndex: 'profilePic',
        render: (val) => {
          return <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>

        }
      },
      {
        title: 'ID',
        key:
          'id',
        dataIndex:
          'id',
        sorter: true,
        searchTextName:
          'id',
        filterRegex:
          true
      },
      {
        title: 'Student Name',
        key: 'studentName',
        dataIndex: 'studentName',
        sorter: true,
        searchTextName: 'studentName',
        filterRegex: true
      },
      {
        title: 'At Stage',
        'key':
          'atLevel',
        'dataIndex':
          'atLevel',
        searchTextName:
          'stage',
        filterRegex:
          true

      },
      {
        title: 'DOB',
        width: 100,
        key: 'dob',
        dataIndex: 'dob',
        searchDateName: 'dob',
        render: (val, record) => {
          return (<div>{record.dateOfBirth ? moment(record.dateOfBirth).format('DD-MMM-YYYY') : ''}</div>)
        }
      },
      {
        title: 'Mobile',
        key:
          'mobile',
        dataIndex:
          'mobile',
        searchTextName:
          'mpbile',
        filterRegex:
          true

      },
      {
        title: 'WhatsApp',
        key:
          'watsupp',
        dataIndex:
          'watsupp',
        searchTextName:
          'watsupp',
        filterRegex:
          true


      },
      {
        title: 'Rating', key:
          'rating', dataIndex:
          'rating'
      },
      {
        title: 'Case Status', key:
          'status', dataIndex:
          'status'
      },
      {
        title: 'Counsellor',
        key:
          'counsellorId',
        searchTextName:
          'counsellor',
        filterRegex:
          true,
        sorter:
          true,
        render:
          (text, record) => {
            return (
              <div>{record.counsellorId ? record.counsellorId.name : ''}</div>)
          }
      },
      {
        title: 'Branch', key:
          'studentBranch', render:
          (text, record) => {
            return (
              <div>
                {record.studentBranchId ? record.studentBranchId.branchName : ''}
              </div>)
          }
      },
      {
        title: 'Preference',
        key:
          'preference',
        render:
          (val, row) => {
            return (row.totalPreference ? <ul className={common.ul}>
                {
                  row.totalPreference.map((val, inde) => {
                    return <li key={inde}>{val.country}</li>
                  })
                }
              </ul> : null
            )

          }
      },
      {
        title: 'Follow Up', key:
          'followUp', width:
          200, dataIndex:
          'followUp', render:
          (text, record) => {
            return (

              <LatestFollowUp info={text}/>

            )

          }
      },
      {
        title: 'Last Updated By', width:
          150, key:
          'updatedByUser', dataIndex:
          'updatedByUser', render:
          (text, record) => {
            return (
              <div>
                <div className={common.user}>{text ? text.name : ''}</div>
                <small>{text ? moment(text.time).format('lll') : ''}</small>
              </div>

            )
          }
      },
      {
        title: 'Action',
        key:
          'operationId',
        dataindex:
          'operationId',
        width:
          100,
        render:
          () => (<React.Fragment>
              <Tooltip title="Edit Details ">
                <Button className={styles.btn}
                        size={'small'}
                        shape="circle" icon="delete"/>
              </Tooltip>
            </React.Fragment>
          )
      }


    ]



  <TableComp
            reloadButon={true}
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 50,
              pageSizeOptions: ['10', '20', '50', '100' , '1000']
            }}
            ref={this.table} columns={columns} extraProps={{ scroll: { x: 600 }, loading }}
            apiRequest={(params) => this.apiRequest(params, columns)}/>
    
```


Incase of memory out of heap
```

export NODE_OPTIONS=--max_old_space_size=4096

```

