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
                            <div className="form-control-icon"></div>
                            <span className="form-control-message">This field should not be empty</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Input Field with Success</h4>
                        <div className="form-group form-group--success">
                            <label htmlFor="input-2">Label</label>
                            <input type="text" id="input-2" className="form-control form-control--white" placeholder="Placeholder"/>
                            <div className="form-control-icon"></div>
                            <span className="form-control-message">Great, there's nothing else you need to do</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Select</h4>
                        <div className="form-group">
                            <label htmlFor="select-1">Select Field</label>
                            <select name="select-1" id="select-1" className="form-control form-control--white">
                                <option value="1">Option 1</option>
                                <option value="1">Option 2</option>
                                <option value="1">Option 3</option>
                                <option value="1">Option 4</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Checkbox</h4>
                        <div className="form-check form-check--white">
                            <input id="check-1" name="check-1" className="form-check-input" type="checkbox" />
                            <label htmlFor="check-1" className="form-check-label">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            </label>
                        </div>
                        <div className="form-check form-check--white">
                            <input id="check-2" name="check-1" className="form-check-input" type="checkbox" />
                            <label htmlFor="check-2" className="form-check-label">
                                Lorem ipsum dolor sit amet, consectetur.
                            </label>
                        </div>
                        <div className="form-check form-check--white">
                            <input id="check-3" name="check-1" className="form-check-input" disabled type="checkbox" />
                            <label htmlFor="check-3" className="form-check-label">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam, tenetur?
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Radio</h4>
                        <div className="form-check form-check--white">
                            <input id="radio-1" name="radio-1" className="form-check-input" type="radio" />
                            <label htmlFor="radio-1" className="form-check-label">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            </label>
                        </div>
                        <div className="form-check form-check--white">
                            <input id="radio-2" name="radio-1" className="form-check-input" type="radio" />
                            <label htmlFor="radio-2" className="form-check-label">
                                Lorem ipsum dolor sit amet, consectetur.
                            </label>
                        </div>
                        <div className="form-check form-check--white">
                            <input id="radio-3" name="radio-1" className="form-check-input" disabled type="radio" />
                            <label htmlFor="radio-3" className="form-check-label">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam, tenetur?
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 mt-2">
                        <h4>Textarea</h4>
                        <div className="form-group">
                            <label htmlFor="input-2">Label</label>
                            <textarea type="text" id="input-2" className="form-control form-control--white" placeholder="Placeholder"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StyleguideForm;