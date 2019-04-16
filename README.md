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
          placeholder: 'Enter Your Make',
          keyAccessor: x => x._id,
          valueAccessor: x => x.name,
          options: this.state.options,
          onChange: (make) => {
            setFieldsValue({make})
          }
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
