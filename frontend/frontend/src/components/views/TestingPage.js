import React from 'react';
import Dropzone from 'react-dropzone'

function TestingPage(props) {

    const onDrop = (files) => {

        console.log(files)
    }

    return (
        <div>
            <Dropzone
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
            >
                {({ getRootProps, getInputProps }) => (
                    <div style={{
                        width: '300px', height: '240px', border: '1px solid lightgray',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                        {...getRootProps()}
                    >
                        {console.log('getRootProps', { ...getRootProps() })}
                        {console.log('getInputProps', { ...getInputProps() })}
                        <input {...getInputProps()} />

                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default TestingPage;