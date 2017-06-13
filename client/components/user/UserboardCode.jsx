import React from 'react';
import * as JsUtils from 'utils/jsUtils';

class UserboardCode extends React.Component {



    generateCode() {
        return `<a href="${ JsUtils.getBaseUrl() }u/${this.props.user.Username}"><img src="${ JsUtils.getBaseUrl() }userboards/${ this.props.user.Id }" alt="Typitap.com userboard for ${ this.props.user.Name }" /></a>`;
    }

    render() {
        return (
            <div>
                <div className="text-muted text-small">You can use this userboard to show off your skills on forums, social media, and so on.<br />
                    Simply copy the code below and paste it whenever you want your stats to show. Your stats will refresh automatically.
                </div>
                <textarea style={{ minHeight: "80px", margin: "15px 0" }} className="form-control" defaultValue={ this.generateCode() }></textarea>

                <div className="text-muted text-small margin-bottom-2">It will display an image like below with a link to your profile:</div>

                <div dangerouslySetInnerHTML={{ __html: this.generateCode() }}></div>
            </div>
        );
    }
}

export default UserboardCode;