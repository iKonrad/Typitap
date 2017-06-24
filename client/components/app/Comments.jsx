import React from 'react';
import {Field, reduxForm} from 'redux-form';
import Comment from 'components/app/Comment';
import Input from 'components/form/fields/Input';
import * as FormActions from 'store/ducks/formModule';
import * as ProfileActions from 'store/ducks/profileModule';
import { connect } from 'react-redux';
import Notifications from 'utils/notifications';
const COMMENTS_PER_PAGE = 10;

class Comments extends React.Component {

    constructor(props) {
        super(props);
    }

    handleSubmitComment(values) {
        values['channelId'] = this.props.id;
        let that = this;
        FormActions.submitComment(values).then((response) => {
            if (response.success) {
                that.props.dispatch(ProfileActions.addComment(that.props.user.data.Username, that.props.user.data.Email, values['text']))
                that.props.dispatch(Notifications.success("Comment added!"));
                that.props.reset();
            }
        });
    }

    renderComments() {
        if (this.props.comments !== undefined && this.props.comments.length > 0) {
            let offset = (this.props.page !== undefined ? (this.props.page - 1) : 0) * COMMENTS_PER_PAGE;
            let commentArray = [];

            for (let i = offset; i < (offset + COMMENTS_PER_PAGE); i++) {
                let comment = this.props.comments[i];
                if (comment !== undefined) {
                    commentArray.push(<Comment key={ 'comment-' + i } text={ comment.Text } user={ comment.User } created={ comment.Created } />)
                }
            }
            return commentArray;
        }

        return <div className="comments__empty">No comments yet. Be the first one.</div>;
    }

    renderPageButtons() {
        if (this.props.comments !== undefined && this.props.comments.length > 0) {
            let pageCount = this.props.comments.length / COMMENTS_PER_PAGE;
            if (pageCount % 1 > 0) {
                pageCount ++;
            }

            let pageButtons = [];
            if (pageCount > 1) {
                for(let i = 1; i <= pageCount; i++) {
                    pageButtons.push(<div className={`comments__page ${this.props.page === i ? "comments__page--selected" : ""}`} key={ `page-${i}`}><button onClick={ this.handlePageClick.bind(this, i) } className="btn btn-link btn-sm">{ i }</button></div>)
                }

                return <div className="comments__pages">{ pageButtons }</div>;
            }
        }

        return "";
    }

    handlePageClick(page) {
        if (this.props.onPageChange !== undefined) {
            this.props.onPageChange(page);
        }
    }

    renderForm() {
        const { handleSubmit, pristine, reset, submitting } = this.props;
        if (this.props.user.loggedIn) {
            return (
                <form onSubmit={ this.props.handleSubmit(this.handleSubmitComment.bind(this)) }>
                    <Field name="text" component={ Input } type="text" label="Add comment" placeholder=""  />
                    <button type="submit" disabled={pristine || submitting} className="btn btn-secondary btn-outline btn-block">Add comment</button>
                </form>
            );
        }
        return "";
    }

    render() {
        return (
            <div id="comments" className="comments">
                { this.renderComments() }
                { this.renderPageButtons() }
                { this.renderForm() }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

Comments = reduxForm({
    form: 'comments',
})(Comments);

export default Comments = connect(mapStateToProps)(Comments);