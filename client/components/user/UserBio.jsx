import React from 'react';
import * as UserUtils from 'utils/userUtils';

class UserBio extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.onLoad !== undefined) {
            this.props.onLoad()
        }
    }

    renderKeyboardField() {
        if ( this.props.user.Keyboard !== "") {
            return <p><strong>Keyboard: </strong>{this.props.user.Keyboard }</p>
        }
        return "";
    }

    renderLayoutField() {
        if (this.props.user.KeyboardLayout !== 0) {
            return <p><strong>Keyboard Layout: </strong>{ UserUtils.getKeyboardForId(this.props.user.KeyboardLayout).name }</p>
        }
        return "";
    }

    renderBio() {
        if (this.props.user.Bio !== "") {
            return <p>{ this.props.user.Bio }</p>
        }
        return <p className="text-muted">This user didn't write any bio.</p>
    }

    render() {
        return (
            <div>
                <div className="col">
                    <div className="row">

                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        { this.renderBio() }
                        { this.renderKeyboardField() }
                        { this.renderLayoutField() }
                    </div>
                </div>
            </div>
        );
    }
}

export default UserBio;