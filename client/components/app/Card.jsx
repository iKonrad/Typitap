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

    componentWillReceiveProps(newProps) {
        if (newProps.loaded !== undefined && newProps.loaded !== this.props.loaded) {
            let state = this.state;
            state.loaded = newProps.loaded;
            this.setState(state);
        }
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

    renderContent(content) {
        if (this.state.loaded) {
            return content;
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
                <div className="card-body">
                    { this.renderTitle() }
                    { this.renderContent(childrenWithProps) }
                </div>
            </div>
        );
    }
}

export default Card;