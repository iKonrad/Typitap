import React, {Component} from 'react';
import {connect} from 'react-redux';
import ProfileInfo from 'components/user/ProfileInfo';
import UserStats from 'components/user/UserStats';
import ActivityFeed from 'components/app/ActivityFeed';
import RecentGames from 'components/user/RecentGames';
import UserBio from 'components/user/UserBio';
import * as DashboardActions from './ducks/dashboardModule';
import Follow from 'components/user/UserFollow';
import * as UserActions from 'store/ducks/userModule';
import * as ProfileActions from 'store/ducks/profileModule';
import Card from 'components/app/Card';
import {resolveAll} from 'utils/jsUtils';
import UserboardSnippet from 'components/user/UserboardSnippet';
import Comments from 'components/app/Comments';
import ChartistGraph from 'react-chartist';


class Dashboard extends Component {

    static clientInit({store, nextState, replaceState, callback}) {
        resolveAll([
            store.dispatch(DashboardActions.fetchActivityFeed(0)),
            store.dispatch(ProfileActions.fetchUserProfile(store.getState().user.data.Username)),
        ], callback);
    }

    componentWillUnmount() {
        this.props.dispatch(DashboardActions.resetActivityFeed());
        this.props.dispatch(ProfileActions.resetUserProfile());
    }

    handleFetchMoreRecentGames() {
        let offset = this.props.dashboard.games.length;
        this.props.dispatch(DashboardActions.getRecentGames(offset));
    }

    turnCommentsPage(page) {
        this.props.dispatch(ProfileActions.turnCommentsPage(page))
    }

    renderEmptyChartMessage() {
        return (
            <div className="row">
                <div className="col-12 mt-2 text-center">
                    <div className="fa fa-frown-o fa-3x text-primary"></div>
                    <h4>No data to display</h4>
                    <p className="text-muted">You need to play for at least 3 days in a row for the chart to show</p>
                </div>
            </div>
        );
    }

    renderChart() {
        if (this.props.profile.charts === undefined || Object.keys(this.props.profile.charts).length < 3) {
            return this.renderEmptyChartMessage();
        }

        let labels = Object.keys(this.props.profile.charts).map((obj) => {
            let date = obj.split("-");
            return date[1] + "/" + date[2]
        });

        let maxWpm = 0;
        let minWpm = 0;

        let series = [Object.keys(this.props.profile.charts).map((key) => {
            let obj = this.props.profile.charts[key];
            maxWpm = obj.wpm > maxWpm ? obj.wpm : maxWpm;
            minWpm = obj.wpm < minWpm ? obj.wpm : minWpm;
            return obj.wpm;
        })];

        let data = {
            labels,
            series,
        };

        let options = {
            high: maxWpm + 10,
            low: Math.max(minWpm - 10, 0),
            axisX: {
                labelInterpolationFnc: function (value, index) {
                    return index % 2 === 0 ? value : null;
                }
            },
        };

        let type = 'Line';
        return (
            <div>
                <div className="text-muted">Practice your typing every day and keep track on how your performance
                    improves over time.
                </div>
                <ChartistGraph data={data} options={options} type={type}/>
            </div>
        )
    }

    render() {

        return (
            <div className="profile-page">
                <ProfileInfo user={this.props.profile.user} stats={this.props.profile.stats}
                             isDashboard={true}/>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-8">

                            <Card title="Stats" subtitle="These stats refresh every hour"
                                  loaded={this.props.profile.stats !== undefined}>
                                <UserStats stats={this.props.profile.stats}/>
                            </Card>


                            <Card loaded={true} title="Progress Charts">
                                {this.renderChart()}
                            </Card>


                            <Card title="Activity feed" bodyClass=""
                                  loaded={this.props.dashboard.feed !== undefined}><ActivityFeed
                                feed={this.props.dashboard.feed}/></Card>

                            <Card title="Your userboard"
                                  loaded={this.props.user !== undefined && this.props.user.data !== undefined}>
                                <UserboardSnippet user={this.props.user.data}/>
                            </Card>

                            <Card
                                title={`Comments (${ this.props.profile.comments !== undefined ? this.props.profile.comments.length : 0 })`}
                                loaded={true}>
                                <Comments
                                    comments={this.props.profile.comments}
                                    id={this.props.user.data.Id}
                                    page={this.props.profile.commentsPage}
                                    onPageChange={this.turnCommentsPage.bind(this)}
                                />
                            </Card>

                        </div>
                        <div className="col-12 col-md-4">
                            <Card title="Recent games" loaded={this.props.profile.games !== undefined}>
                                <div className="result-rows">
                                    <RecentGames onMore={this.handleFetchMoreRecentGames.bind(this)}
                                                 games={this.props.profile.games}/>
                                </div>
                            </Card>
                            <Card title="About" loaded={this.props.user !== undefined && this.props.user.data !== undefined}>
                                <UserBio user={this.props.user.data}/>
                            </Card>
                            <Follow title="Followers" items={this.props.profile.follow.followers}/>
                            <Follow title="Following" items={this.props.profile.follow.following}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        dashboard: state.dashboard,
        profile: state.profile,
    }
};

export default connect(mapStateToProps)(Dashboard);