import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import Panel from 'components/app/Panel';
import * as SubmitTextActions from "scenes/SubmitText/ducks/submitTextModule";
import Textarea from 'components/form/fields/textarea';
import Input from 'components/form/fields/Input';
import {Field, reduxForm, formValueSelector, change} from 'redux-form';
import TextStats from 'components/form/ui/TextStats';
import * as AdminTextActions from "#app/scenes/Admin/scenes/AdminText/ducks/adminTextModule";
import Notifications from "#app/utils/notifications";

class SubmitText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isBook: false,
        }
    }

    static clientInit({store, next, replace, callback}) {
        callback();
    }

    // Runs after side-server rendering
    static initialize(response, params, store) {
        return "";
    }

    handleSubmit(values) {
        return SubmitTextActions.submitForm(values).then((details) => {
            this.props.reset("submit_text");
            this.props.dispatch(Notifications.success("Your text has been submitted! We will get back to you when your text is accepted."));
        });
    }

    onBookValueChange() {
        let state = this.state;
        state.isBook = !state.isBook;
        this.setState(state);

        if (!state.isBook) {
            this.props.change("ISBN", "");
        }
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <div className="container">
                <div className="row margin-top-5">
                    <div className="col col-xs-12">
                        <h2>Submit your text</h2>
                        <p>Submit your text and we'll add it to game. We'll drop you an e-mail when your text is available to play.</p>
                        <p>Make sure your text isn't too long and doesn't have any extraordinary symbols (widely used symbols like commas, full-stops, colons etc. are accepted).</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-md-8">
                        <Panel loaded={true}>
                            <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
                                <Field id="Text" name="Text" placeholder="Enter your text here" component={Textarea} className="form-control" label="Text"/>
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
                                        <Field id="isBook" name="isBook" className="form-check-input"
                                               component="input" type="checkbox" onChange={ this.onBookValueChange.bind(this) } />
                                        <label htmlFor="isBook" className="form-check-label">This is a quote from a book</label>
                                    </div>
                                    <p className="small">
                                        If you have taken this text from a book, that's great. Just please provide an <strong>ISBN</strong> number so we can display more information about the book to people.
                                    </p>
                                </div>
                                <div className="form-group" style={ this.state.isBook ? {} : {display: "none"} }>
                                    <Field name="ISBN" component={Input} type="text" label="ISBN"/>
                                </div>
                                <div className="form-group">
                                    <button type="submit" disabled={pristine || submitting}
                                            className="btn btn-primary btn-block">{submitting ? "Submitting..." : "Submit"}</button>
                                </div>
                            </form>
                        </Panel>
                    </div>
                    <div className="col col-md-4">
                        <Panel loaded={true} title="Text stats">
                            {<TextStats text={this.props.text}/>}
                        </Panel>
                    </div>
                </div>
            </div>

        );
    }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
SubmitText = reduxForm({
    form: 'submit_text',  // a unique identifier for this form
    enableReinitialize: true,
})(SubmitText);

const selector = formValueSelector('submit_text');

// You have to connect() to any reducers that you wish to connect to yourself
SubmitText = connect(
    state => {
        return {
            initialValues: state.adminText.data,
            adminText: state.adminText,
            text: selector(state, "Text"),
            changeFieldValue: function(field, value) {
                dispatch(change(form, field, value))
            }
        }
    },
    {
        load: SubmitTextActions.loadDataValues
    }
)(SubmitText);

export default SubmitText