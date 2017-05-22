import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as AccountActions from 'store/modules/accountModule';
import * as UserActions from 'store/modules/userModule';
import Notifications from 'utils/notifications';

class AccountSimpleItem extends React.Component {
    static onEnter({store, next, replace, callback}) {
        callback();
    }

    // Runs after side-server rendering
    static initialize(response, params, store) {
        return "";
    }

    renderField() {

        if (this.props.account.details[this.props.name] === undefined) {
            return "No state set up for this field";
        }

        if (this.props.account.details[this.props.name].open) {
            return (
                <div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="input-group">
                            <input type={ this.props.name === "Password" ? "password" : "text" }
                                   ref={`field-${this.props.name}`} name={this.props.name}
                                   defaultValue={ this.props.user.data[this.props.name] }
                                   placeholder={`Enter new ${this.props.name}`} className="form-control control-small"/>
                            <span className="input-group-btn">
                            <button type="submit" className="btn btn-primary btn-sm">Save</button>
                        </span>
                        </div>
                    </form>
                </div>
            );
        } else {
            let name = this.props.name;
            let value = "";

            if (name !== "Password") {
                if (this.props.user.data[name] !== undefined) {
                    value = this.props.user.data[name];
                } else {
                    return (<div>Invalid '{name}' key passed to the component</div>)
                }
            } else {
                value = "*********";
            }

            return value;
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
            return (<button className=" account__item__button btn btn-primary btn-sm btn-outline"
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
                this.props.dispatch(Notifications.success(`${this.props.name} has been updated successfully`));
                that.props.dispatch(UserActions.updateUserField(that.props.name, field.value));
            } else {
                this.props.dispatch(Notifications.error(response.message));
            }
        })
    }

    render() {
        let name = this.props.name;
        let value = "";
        return (
            <div className="account__item">
                <div className="row">
                    <div className="col col-xs-12 col-sm-5">
                        <div className="account__item__label">{ name }</div>
                        <div className="account__item__value">{ this.renderField() }</div>
                    </div>
                    <div className="col col-xs-12 col-sm-7 text-right" style={{paddingTop: "10px"}}>
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