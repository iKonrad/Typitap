import React, { Component } from 'react';
import Spinner from 'components/app/Spinner';

class Card extends Component {
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
                <div>
                    <h3 className="card-title">{ this.props.title }</h3>
                    <h6 className="card-subtitle">{ this.props.subtitle !== undefined ? this.props.subtitle : "" }</h6>
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
            <div className={`card ${this.props.className !== undefined ? this.props.className : ""}`}>
                <div className={ this.props.bodyClass !== undefined ? this.props.bodyClass : "card-body" }>
                    { this.renderTitle() }
                    { this.renderSpinner() }
                    { childrenWithProps }
                </div>
            </div>
        );
    }
}

export default Card;