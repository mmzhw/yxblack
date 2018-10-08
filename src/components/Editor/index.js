import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
// import PropTypes from 'prop-types'
import './style.css';
import 'react-quill/dist/quill.snow.css';

const Size = Quill.import('formats/size');

Size.whitelist = ['12', '14', '16', '18', '20'];

Quill.register(Size, true);
// Quill.register(Color, true)

const toolbarOptions = [
    ['bold', 'italic'],

    [{ 'size': ['12', '14', '16', '18', '20'] }], // custom dropdown

    [{ 'color': [] }], // remove formatting button
];

// const CustomToolbar = () => (
//   <div id='toolbar'>
//     <select className='ql-header'>
//       <option value='1'></option>
//       <option value='2'></option>
//       <option value='3'></option>
//     </select>
//     <select className='ql-size'>
//       <option value='12'>12px</option>
//       <option value='16'>16px</option>
//       <option value='18'>18px</option>
//     </select>
//     <button className='ql-bold'></button>
//     {/* <button className='ql-italic'></button> */}
//     <div className='ql-color'>
//       {/* <SketchPicker/> */}
//     </div>
//   </div>
// )

const modules = {
    toolbar: toolbarOptions
};

export default class Editor extends Component {
    // static PropTypes ={
    //   value: PropTypes.string,
    //   onChange: PropTypes.func
    // }

    onChange = (value) => {
    // if(value === '<p><br></p>'){
    //   return
    // }
    // this.props.onChange(value)
    }

    render() {
        const { value, onChange } = this.props;
        return (
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
            />
        );
    }
}
