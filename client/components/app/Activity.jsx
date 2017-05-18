import React from 'react';
import TimeAgo from 'timeago-react';

class Activity extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div className="activity">
                <div className="row">
                    <div className="col col-xs-2 col-sm-1">
                        <div className={`activity__icon activity__icon--${ this.props.icon }`}></div>
                    </div>
                    <div className="col col-xs-10 col-sm-11">
                        <div className="activity__text" dangerouslySetInnerHTML={{__html: this.props.text}}>
                        </div>
                        <div className="activity__date">
                            <TimeAgo datetime={ this.props.date }/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Activity;