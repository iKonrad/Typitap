import React, {Component} from 'react';
import {connect} from 'react-redux';
import ResultRow from "./ResultRow";
import { Link } from 'react-router';

class TopChart extends Component {


    renderItems(name) {


        if (this.props.app.charts !== undefined && Object.keys(this.props.app.charts[name]).length > 0) {

            let chart = this.props.app.charts[name];

            let items = chart.Items.map((item, index) => {
                let userNameLink = <Link to={"/u/" + item.User.Username}>#{item.User.Username}</Link>;
                return <ResultRow perfect={ item.Accuracy === 100 } key={ 'activity-item-' + index } date={ new Date(item.Created)} name={ userNameLink } score={ item.WPM } place={ index + 1 } resultId={ item.Id } />
            });

            return items;
        }

        return "Invalid chart name: " + name;

    }

    render() {



        return (
            <div className="panel panel-default">
                <div className="panel-heading"><h3>{this.props.title}</h3></div>
                { this.renderItems(this.props.name) }
            </div>
        );
    }
}

var mapStateToProps = (state) => {
    return {
        app: state.app,
    };
};

export default connect(mapStateToProps)(TopChart);