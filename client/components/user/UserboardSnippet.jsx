import React from 'react';
import * as JsUtils from 'utils/jsUtils';

class UserboardSnippet extends React.Component {



    generateCode(forWeb) {
        return `<a href="${ JsUtils.getBaseUrl() }u/${this.props.user.Username}"><img src="${ JsUtils.getBaseUrl() }userboards/${ this.props.user.Id }" alt="Typitap.com userboard for ${ this.props.user.Name }" /></a>`;
    }

    render() {
        return (
            <div>
                <div className="text-muted text-small">You can use this userboard to show off your skills on forums, social media, and so on.<br />
                    Simply copy the code below and paste it whenever you want your stats to show. Your stats will refresh automatically.
                </div>
                <textarea style={{ minHeight: "80px", margin: "15px 0", color: "grey", resize: "none", fontFamily: "Courier New", fontSize: "14px", fontWeight: "100" }} className="form-control" readOnly value={ this.generateCode() }></textarea>

                <div className="text-muted text-small mb-2">It will display an image like below with a link to your profile:</div>

                <div>
                    <a href={`${ JsUtils.getBaseUrl() }u/${this.props.user.Username}`}>
                        <img className="img-fluid" src={`${ JsUtils.getBaseUrl() }userboards/${ this.props.user.Id }`} alt={`Typitap.com userboard for ${ this.props.user.Name }`} />
                    </a>
                </div>
            </div>
        );
    }
}

export default UserboardSnippet;