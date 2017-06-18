import React from 'react';
import Gravatar from 'components/user/Gravatar';
import { Link } from 'react-router';
import TimeAgo from 'components/app/TimeAgo';

class Comment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="comment">
                <div className="comment__text">{ this.props.text }</div>
                <Link to={ "/u/" + this.props.user.Username }>
                    <div className="comment__author">
                        <div className="comment__author__avatar"><Gravatar email={ this.props.user.Email } size={ 20 } /></div>
                        <div className="comment__author__username">#{ this.props.user.Username }</div>
                    </div>
                </Link>
                <div className="comment__created"><TimeAgo date={ this.props.created } /></div>
            </div>
        );
    }
}

export default Comment;