import React from 'react';
import Item from './UserFollowItem';

class UserFollow extends React.Component {

    renderItems() {
        if (this.props.items.length > 0) {
            return this.props.items.map((item, i) => {
                return (
                    <Item key={`follow-item-` + i} email={item.Email || item.email} username={item.Username || item.username}/>
                );
            });
        }

        return (
            <div className="text-center text-muted">No followers</div>
        );

    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3>{ this.props.title } ({ this.props.items.length })</h3>
                </div>
                <div className="panel-body">
                    <div className="row">
                        { this.renderItems(this.props.items) }
                    </div>
                </div>
            </div>
        );
    }
}

export default UserFollow;