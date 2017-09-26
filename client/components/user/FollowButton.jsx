import React from 'react';
import * as FollowUtils from 'utils/followUtils';

class FollowButton extends React.Component {
    constructor(props) {
        super(props);
        let following = FollowUtils.isUserFollowing(props.id);
        this.state = {
            following: following,
            blocked: false,
        }
    }

    // Udpate the following state
    componentWillReceiveProps(newProps) {
        if (newProps.id !== this.props.id) {
            let state = this.state;
            state.following = FollowUtils.isUserFollowing(newProps.id);
            this.setState(state);
        }
    }


    // Call the follow action
    handleFollow() {
        if (!this.state.blocked) {
            FollowUtils.toggleFollow(this.props.id, !this.state.following).then((response) => {
                if (response.success) {
                    let state = this.state;
                    if (!this.state.following) {
                        state.following = true;
                        state.blocked = true;
                        FollowUtils.followUser();

                    } else {
                        state.following = false;
                        FollowUtils.unfollowUser();
                    }
                    this.setState(state);
                }
            })
        }
    }

    render() {
        let {id} = this.props;
        if (id !== undefined && id !== "") {
            return (
                <div>
                    <button
                        onClick={ this.handleFollow.bind(this) }
                        className={`btn btn-follow btn-xs ${ this.state.following ? "btn-follow--following" : "" }`}
                    >
                        <i className="fa fa-thumbs-o-up"></i>
                        { this.state.following ? 'following' : 'follow' }
                    </button>
                </div>
            );
        }
        return null;
    }
}

export default FollowButton;