import React, { Component } from 'react';
import Spinner from 'components/app/Spinner';

class Panel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: this.props.loaded !== undefined ? this.props.loaded : false,

        }
    }

    handleLoaded() {
        let state = this.state;
        state.loaded = true;
        this.setState(state);
    }

    renderTitle() {
        if (this.props.title !== undefined) {
            return (
                <div className="panel-heading">
                    <h3>{ this.props.title }</h3>
                </div>
            )
        }
        return "";
    }


    renderSpinner() {
        if (this.state.loaded) {
            return "";
        } else {
            return <Spinner />;
        }
    }

    render() {

        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                onLoad: this.handleLoaded.bind(this)
            })
        );

        return (
            <div className={`panel panel-default ${this.props.className !== undefined ? this.props.className : ""}`}>
                { this.renderTitle() }
                <div className={ this.props.bodyClass !== undefined ? this.props.bodyClass : "panel-body" }>
                    { this.renderSpinner() }
                    { childrenWithProps }
                </div>
            </div>
        );
    }
}

export default Panel;