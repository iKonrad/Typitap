import React, {Component} from 'react';
import {connect} from 'react-redux';
import StatsBadge from 'components/user/UserStatsBadge';

class UserStats extends Component {


    componentWillUpdate(newProps) {
        if (newProps.stats !== undefined && this.props.stats === undefined) {
            if (this.props.onLoad !== undefined) {
                this.props.onLoad();
            }
        }
    }



    renderStatsItems(items) {

        if (items !== undefined && Object.keys(items).length > 0) {

            return (
                <div>
                    <div className="pull-left">
                        <StatsBadge key={ `user-stat-wpm` } type="wpm" label="wpm" value={ items["wpm"] }/>
                        <StatsBadge key={ `user-stat-accuracy` } type="accuracy" label="accuracy" value={ items["accuracy"] + "%" }/>
                    </div>
                    <div className="pull-right">
                        <StatsBadge key={ `user-stat-goldenTrophies` } type="goldenTrophies"
                                    value={ items["goldenTrophies"] }/>
                        <StatsBadge key={ `user-stat-silverTrophies` } type="silverTrophies"
                                    value={ items["silverTrophies"] }/>
                        <StatsBadge key={ `user-stat-bronzeTrophies` } type="bronzeTrophies"
                                    value={ items["bronzeTrophies"] }/>
                    </div>
                </div>

            );
        }

        return "";

    }

    render() {
        return (
            <div>
                { this.renderStatsItems(this.props.stats) }
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