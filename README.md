# sz-react-utils


### Handing Forms

```jsx harmony

import {FormUtils} from 'sz-react-utils';

/*
* -----
* ---
* 
* */

let inputTypes = {
  fields: [
    {
      key: 'firstName',
      label: 'First Name' // optional
    },
    {key: 'middlename'},
    {key: 'lastname'},
    {
      key: 'gender',
      type: 'select',
      options: ['Male', 'Female', 'other', 'Prefer not to say']
    },
    {
      key: 'gender',
      type: 'select',
      options: [
        {_id: 'one', display: 'One Name'}
      ]
    },
    {
      key: 'image',
      type: 'file',
      limit: 2 // default is 1
    },

  ]
}


/*
* -----
* ---
* 
* */


const formProps = {
  getFieldDecorator, 
  getFieldValue , // required for upload to work
  apiurl // required for upload to work
}

return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        <FormUtils inputSchema={inputTypes} {...formProps}/>
      </Form>
 

)

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
