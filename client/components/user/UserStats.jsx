
import React, {Component} from 'react';
import {connect} from 'react-redux';
import StatsBadge from 'components/user/UserStatsBadge';
import * as UserActions from 'store/modules/userModule';

class UserStats extends Component {

    componentWillMount() {

        if (this.props.user.stats === undefined || Object.keys(this.props.user.stats).length === 0) {
            this.props.dispatch(UserActions.fetchUserStats());
        }

    }

    renderStatsItems(items) {

        if (items !== undefined && Object.keys(items).length > 0) {

            return (
                <div>
                    <div className="pull-left">
                        <StatsBadge key={ `user-stat-wpm` } type="wpm" value={ items["wpm"] } />
                        <StatsBadge key={ `user-stat-accuracy` } type="accuracy" value={ items["accuracy"] } />
                    </div>
                    <div className="pull-right">
                        <StatsBadge key={ `user-stat-goldenTrophies` } type="goldenTrophies" value={ items["goldenTrophies"] } />
                        <StatsBadge key={ `user-stat-silverTrophies` } type="silverTrophies" value={ items["silverTrophies"] } />
                        <StatsBadge key={ `user-stat-bronzeTrophies` } type="bronzeTrophies" value={ items["bronzeTrophies"] } />
                    </div>
                </div>

            );
        }

        return "";

    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    { this.renderStatsItems(this.props.stats) }
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(UserStats);