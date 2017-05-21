import React from 'react';
import Gravatar from 'components/user/Gravatar';
import {Link} from 'react-router';

class UserFollowItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col col-xs-6">
                <Link to={ `/u/` + this.props.username }>
                    <div className="follow-item">
                        <Gravatar email={ this.props.email } size={30} className="img-circle" />
                        <div className="follow-item__username">{ this.props.username }</div>
                    </div>
                </Link>

            </div>
        );
    }
}

export default UserFollowItem;