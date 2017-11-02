import React, {Component} from 'react';


const Textarea = ({input, label, placeholder, type, meta: {touched, error}}) => {

    let formGroupClasses = error !== undefined ? "form-group has-error" : "form-group";
    return (
        <div className={formGroupClasses}>
            <label className="control-label" htmlFor={input.name}>{label}</label>

            <textarea {...input} placeholder={placeholder || label} className="form-control" style={{resize: "vertical", minHeight: "140px"}} />
            {touched && error && <span className="help-block">{error}</span>}

        </div>
    );
};

export default Textarea;

