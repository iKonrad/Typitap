import React from 'react';
import Item from './UserFollowItem';
import Card from 'components/app/Card';

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
            <Card title={`${ this.props.title } (${ this.props.items.length })`} loaded={true}>
                <div className="row">
                    { this.renderItems(this.props.items) }
                </div>
            </Card>
        );
    }
}

export default UserFollow;