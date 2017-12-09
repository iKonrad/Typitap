import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import Card from 'components/app/Card';
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

    renderCodeField() {

        if (this.props.type !== undefined && this.props.type !== "") {
            return (
                <div className="form-group">
                    <Field id="Code" name="Code" component={Input} label={ this.props.type } placeho className="form-control" />
                </div>
            );
        }
        return <div></div>
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col">
                        <h2>Submit your text</h2>
                        <p>Submit your text and we'll add it to game. We'll drop you an e-mail when your text is available to play.</p>
                        <p>Make sure your text isn't too long and doesn't have any extraordinary symbols (widely used symbols like commas, full-stops, colons etc. are accepted).</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <Card loaded={true}>
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
                                    <label htmlFor="Source">Is this text from a book, movie or a song?</label>
                                    <Field id="Source" name="Source" component="select"
                                           className="form-control">
                                        <option value="other">Other sources / my own</option>
                                        <option value="book">Book</option>
                                        <option value="movie">Movie</option>
                                        <option value="song">Song</option>
                                    </Field>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Type">Please provide a book/song title, or ISBN/Amazon Code if available</label>
                                    <Field id="Type" name="Type" component="select"
                                           className="form-control">
                                        <option value="">None</option>
                                        <option value="title">Title</option>
                                        <option value="ISBN">ISBN number</option>
                                        <option value="ASIN">Amazon Item ID (ASIN)</option>
                                    </Field>
                                </div>
                                { this.renderCodeField() }
                                <div className="form-group">
                                    <button type="submit" disabled={pristine || submitting}
                                            className="btn btn-primary btn-block">{submitting ? "Submitting..." : "Submit"}</button>
                                </div>
                            </form>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card loaded={true} title="Text stats">
                            {<TextStats text={this.props.text}/>}
                        </Card>
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
            type: selector(state, "Type"),
            status: selector(state, "Status"),
        }
    },
    {
        load: SubmitTextActions.loadDataValues
    }
)(SubmitText);

export default SubmitText