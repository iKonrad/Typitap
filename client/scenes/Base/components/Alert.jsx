import React from 'react';

class Alert extends React.Component {
    constructor(props) {
        super(props);
    }

    renderIcon(type) {
        switch(type) {
            case 'error':
                return  <i className="fa fa-exclamation-circle"></i>;
            case 'warning':
                return <i className="fa fa-exclamation-triangle"></i>;
        }

        return <i className="fa fa-check"></i>;
    }

    render() {
        return (
            <div className={`alert-bar alert-bar--${this.props.type !== undefined ? this.props.type : "success"}`}>
                <div className="container">

                    <div className="alert-bar__icon">
                        { this.renderIcon(this.props.type) }
                    </div>
                    <div className="alert-bar__message">
                        { this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Alert;