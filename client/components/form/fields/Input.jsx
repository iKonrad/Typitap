import React, {Component} from 'react';


const Input = ({input, label, type, meta: {touched, error}}) => {

    let formGroupClasses = error !== undefined ? "form-group form-group--error" : "form-group";
    return (
        <div className={formGroupClasses}>
            <label className="control-label" htmlFor={input.name}>{label}</label>

            <input {...input} placeholder={label} className="form-control" type={type}/>
            {touched && error && <span className="form-control-error">{error}</span>}

        </div>
    );
};

export default Input;

