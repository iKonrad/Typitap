import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import Input from 'components/form/fields/Input';
import Panel from 'components/app/Panel';
import * as AdminTextActions from './ducks/adminTextModule';
import Textarea from 'components/form/fields/textarea';
import {Link} from 'react-router';
import Notifications from 'utils/notifications';
import Spinner from 'components/app/Spinner';
import TextStats from 'components/form/ui/TextStats';

class AdminText extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.params.id,
            data: []
        }
    }

    fetchFormData() {
        if (this.state.id !== "new" && this.state.id !== "") {
            fetch(`/api/admin/texts/${ this.state.id }`, {
                credentials: "same-origin",
                headers: {
                    "Cookie": global.clientCookies
                }
            }).then((response) => {
                return response.json();
            }).then((response) => {
                if (response.success) {
                    response.data.Language = response.data.Language.Id;
                    this.props.dispatch(this.props.load(response.data));
                } else {
                    this.props.dispatch(Notifications.error("An error occurred while fetching the text"));
                }
            });
        }
    }

    componentWillMount() {
        this.fetchFormData();
    }

    componentWillUnmount() {
        this.props.dispatch(AdminTextActions.resetDataValues())
    }

    handleSubmitForm(values) {
        return AdminTextActions.submitForm(values).then((details) => {
            if (this.state.id === "new" || this.state.id === "") {
                this.props.reset("admin_text");
            } else {
                this.props.load(values);
            }
            this.props.dispatch(Notifications.success("Text saved successfully"));
        });
    };

    renderAcceptButton() {
        if (this.props.accepted === undefined || !this.props.accepted) {
            return (
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block" onClick={ this.handleAcceptButtonClick.bind(this) }>Accept text</button>
                </div>
            )
        }
        return <div></div>;
    }

    handleAcceptButtonClick() {
        return AdminTextActions.acceptText(this.state.id).then((details) => {
            this.fetchFormData();
            this.props.dispatch(Notifications.success("Text accepted. User has been notified via e-mail"));
        });
    }

    updateField(fieldName, e) {
        let value = e.target.value;
        let state = this.state;
        state.data[fieldName] = value;
        this.setState(state);
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        if ((this.state.id !== "new" && Object.keys(this.props.adminText.data).length > 0) || this.state.id === "new") {
            return (
                <div>
                    <div className="row">
                        <div className="col col-xs-12">
                            <h1><Link to="/admin/texts" className="btn btn-circle btn-outline btn-pink btn-sm"><i
                                className="fa fa-chevron-left"></i></Link> {this.state.id === "new" ? "Add new text" : "Edit text"}
                            </h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-md-8">
                            <Panel loaded={true}>
                                <h4 className="text-bold">{this.state.id === "new" ? "" : "ID: " + this.props.adminText.data.Id}</h4>
                                <form onSubmit={handleSubmit(this.handleSubmitForm.bind(this))}>
                                    <Field id="Accepted" name="Accepted" component="hidden" />
                                    <div className="form-group">
                                        <label htmlFor="language">Text</label>
                                        <Field id="Text" name="Text" component={Textarea} className="form-control"
                                               onChange={this.updateField.bind(this, "Text")}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="language">Language</label>
                                        <Field id="Language" name="Language" component="select"
                                               className="form-control">
                                            <option value="EN">English</option>
                                            <option value="PL">Polish</option>
                                        </Field>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-check">
                                            <Field id="Disabled" name="Disabled" className="form-check-input"
                                                   component="input" type="checkbox"/>
                                            <label htmlFor="Disabled" className="form-check-label">Disabled</label>
                                        </div>
                                        <p className="small">When this option is enabled, this text will no longer will show up in the game</p>
                                    </div>
                                    <div className="form-group">
                                        <Field name="ISBN" component={Input} type="text" label="ISBN"/>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={pristine || submitting}
                                                className="btn btn-pink btn-block">{submitting ? "Saving..." : "Save"}</button>
                                    </div>
                                </form>
                                { this.renderAcceptButton() }
                            </Panel>
                        </div>
                        <div className="col col-md-4">
                            <Panel loaded={true}>
                                { <TextStats text={ this.props.text } /> }
                            </Panel>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-center margin-top-5">
                    <Spinner/>
                </div>
            );
        }
    }
}


// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
AdminText = reduxForm({
    form: 'admin_text',  // a unique identifier for this form
    enableReinitialize: true,
})(AdminText);

const selector = formValueSelector('admin_text');

// You have to connect() to any reducers that you wish to connect to yourself
AdminText = connect(
    state => {
        return {
            initialValues: state.adminText.data,
            adminText: state.adminText,
            text: selector(state, "Text"),
            accepted: selector(state, "Accepted"),
        }
    },
    {load: AdminTextActions.loadDataValues}               // bind account loading action creator
)(AdminText);

export default AdminText