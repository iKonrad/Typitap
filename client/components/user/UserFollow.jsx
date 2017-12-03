import React from 'react';
import Item from './UserFollowItem';
import Card from 'components/app/Card';

class UserFollow extends React.Component {

    renderItems() {
        if (this.props.items.length > 0) {
            let items =  this.props.items.map((item, i) => {
                return (
                    <Item key={`follow-item-` + i} email={item.Email || item.email} username={item.Username || item.username}/>
                );
            });

            return <div className="row">{ items }</div>
        }

        return (
            <div className="text-center text-muted mt-4 mb-2">No followers</div>
        );

    }

    render() {
        return (
            <Card title={`${ this.props.title } (${ this.props.items.length })`} loaded={true}>
                { this.renderItems(this.props.items) }
            </Card>
        );
    }
}

export default UserFollow;