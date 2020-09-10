import React, { useState } from 'react';
import { Upload, Button, Icon } from 'antd';

class InputUpload extends React.Component<{ value?: any, onChange?: () => void }>{

    render() {

        return (
            <Upload
                name="logo"
                listType="picture"
                customRequest={(e) => { }}
                onChange={this.props.onChange}
                defaultFileList={this.props.value}
            >
                <Button>
                    <Icon type="upload" /> Click para agregar
                            </Button>
            </Upload>
        )
    }
}

export default InputUpload;
