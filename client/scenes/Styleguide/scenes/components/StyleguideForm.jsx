import React from 'react';

class StyleguideForm extends React.Component {
    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col mt-2">
                        <h2>Form</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Input Field</h4>
                        <div className="form-group">
                            <label htmlFor="input-1">Label</label>
                            <input type="text" id="input-1" className="form-control form-control--white" placeholder="Placeholder"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Input Field with Error</h4>
                        <div className="form-group form-group--error">
                            <label htmlFor="input-2">Label</label>
                            <input type="text" id="input-2" className="form-control form-control--white" placeholder="Placeholder"/>
                            <span className="form-control-error">This field should not be empty</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StyleguideForm;