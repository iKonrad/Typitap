import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as AccountActions from 'store/ducks/accountModule';
import * as UserActions from 'store/ducks/userModule';
import Notifications from 'utils/notifications';

class AccountSimpleItem extends React.Component {
    static onEnter({store, next, replace, callback}) {
        callback();
    }


    renderField() {

        if (this.props.account.details[this.props.name] === undefined) {
            return "No state set up for this field";
        }

        if (this.props.account.details[this.props.name].open) {
            return (
                <div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group">
                            <div className="input-group">
                                { this.renderInput() }
                                <span className="input-group-btn">
                                <button type="submit" className={`btn btn-primary btn-${this.props.type !== undefined && this.props.type === "textarea" ? "lg" : "sm"}`}>Save</button>
                            </span>
                            </div>
                        </div>
                    </form>
                </div>
            );
        } else {
            let name = this.props.name;
            let value = "";

            if (this.props.type === "password") {
                value = "*********"
            } else if (this.props.user.data[name] !== undefined) {
                if (this.props.type === "select") {
                    value = this.getSelectedOption();
                } else {
                    value = this.props.user.data[name];
                }
            } else {
                return (<div>Invalid '{name}' key passed to the component</div>)
            }
            return value;
        }
    }

    getSelectedOption() {
        let v = "";
        this.props.options.forEach((option) => {
            if (option.value === this.props.user.data[this.props.name]) {
                v = option.name;
            }
        })
        return v;
    }

    renderInput() {


        if (this.props.type === undefined || this.props.type === "text") {
            return (
                <input type="text"
                       ref={`field-${this.props.name}`} name={this.props.name}
                       defaultValue={ this.props.user.data[this.props.name] }
                       placeholder={`Enter new ${this.props.name}`} className="form-control"/>
            );
        } else if (this.props.type === "textarea") {
            return (
                <textarea type={ this.props.name === "Password" ? "password" : "text" }
                          ref={`field-${this.props.name}`} name={this.props.name}
                          defaultValue={ this.props.user.data[this.props.name] }
                          placeholder={`Enter new ${this.props.name}`} className="form-control form-control--sm"
                          style={{height: "50px", resize: "none", width: "100%"}}></textarea>

            );
        } else if (this.props.type === "password") {
            return (
                <input type="password"
                       ref={`field-${this.props.name}`} name={this.props.name}
                       defaultValue={ this.props.user.data[this.props.name] }
                       placeholder={`Enter new ${this.props.name}`} className="form-control"/>
            );
        } else if (this.props.type === "select" && this.props.options !== undefined && this.props.options.length > 0) {

            let renderOptions = (options) => {
                return options.map((option) => {
                    return <option key={option.value} value={option.value}>{option.name}</option>
                });
            };

            return (
                <select ref={`field-${this.props.name}`} defaultValue={ this.props.user.data[this.props.name] }
                        name={this.props.name} placeholder={`Select your ${this.props.name}`}
                        className="form-control form-control--sm">
                    { renderOptions(this.props.options) }
                </select>
            );
        }
    }

    toggleButton() {
        if (this.props.account.details[this.props.name].open) {
            this.props.dispatch(AccountActions.closeEditField(this.props.name));
        } else {
            this.props.dispatch(AccountActions.openEditField(this.props.name));
        }
    }

    componentDidUpdate() {
        // Automatically focus on the field
        if (this.refs[`field-${this.props.name}`] !== undefined) {
            this.refs[`field-${this.props.name}`].focus();
        }
    }

    componentWillUnmount() {
        if (this.props.account.details[this.props.name].open) {
            this.props.dispatch(AccountActions.closeEditField(this.props.name));
        }
    }

    renderEditButton() {
        if (this.props.account.details[this.props.name] === undefined) {
            return "";
        }

        if (this.props.account.details[this.props.name].open) {
            return "";
        } else {
            return (<button className=" account__item__button btn btn-primary btn-xs btn-outline"
                            onClick={ this.toggleButton.bind(this) }>{ this.props.name !== "Password" ? "Edit" : "Change Password" }</button>);
        }
    }

    handleSubmit(e) {

        e.preventDefault();
        let that = this;
        let field = this.refs[`field-${this.props.name}`];
        this.props.dispatch(AccountActions.submitField(this.props.name, field.value)).then((response) => {
            if (response.success) {
                this.toggleButton();

                this.props.dispatch(Notifications.success(response.message));
                that.props.dispatch(UserActions.updateUserField(that.props.name, field.value));
            } else {
                this.props.dispatch(Notifications.error(response.message));
            }
        })
    }

    render() {
        let label = this.props.label !== undefined ? this.props.label : this.props.name;
        let value = "";
        return (
            <div className="account__item">
                <div className="row">
                    <div className="col-12 col-sm-5">
                        <div className="account__item__label">{ label }</div>
                        <div className="account__item__value">{ this.renderField() }</div>
                    </div>
                    <div className="col-12 col-sm-7 text-right" style={{paddingTop: "10px"}}>
                            { this.renderEditButton() }
                    </div>
                </div>
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return {
        account: state.account,
        user: state.user
    }
};

export default connect(mapStateToProps)(AccountSimpleItem);