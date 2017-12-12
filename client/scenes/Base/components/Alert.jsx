import React from 'react';
import Icon from '@fortawesome/react-fontawesome';

class Alert extends React.Component {
    constructor(props) {
        super(props);
    }

    renderIcon(type) {
        switch(type) {
            case 'error':
                return  <Icon icon={['far', 'exclamation-circle']} size="2x" />;
            case 'warning':
                return <Icon icon={['far', 'exclamation-triangle']} size="2x" />;
        }

        return <i className="fa fa-check"></i>;
    }

    render() {
        return (
            <div className={`alert-bar alert-bar--${this.props.type !== undefined ? this.props.type : "success"}`}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="alert-bar__icon">
                                { this.renderIcon(this.props.type) }
                            </div>
                            <div className="alert-bar__message">
                                { this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Alert;