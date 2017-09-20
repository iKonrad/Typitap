import React from 'react';
import { Link } from 'react-router';

class Footer extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer id="footer" className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 col-sm-4">
                                <div className="margin-top-4">
                                    <div className="white">made with <i className="fa fa-heart text-danger" style={{margin: "0px 3px"}}></i> by <a href="http://jarosinski.uk" className="white" target="_blank">Konrad Jarosinski</a></div>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-8">
                                <div className="text-right margin-top-4">
                                    <Link to="/" className="white" style={{marginRight: "13px"}}>Home</Link>
                                    <Link to="/about" className="white" style={{marginRight: "13px"}}>About</Link>
                                    <Link to="/play" className="white" style={{marginRight: "13px"}}>Play</Link>
                                    <Link to="/terms" className="white" style={{marginRight: "13px"}}>Terms</Link>
                                    <Link to="/privacy" className="white" style={{marginRight: "13px"}}>Privacy</Link>
                                    <a href="mailto:konrad@jarosinski.uk" className="white" style={{marginRight: "13px"}}>Contact</a>
                                    <a href="http://community.typitap.com" className="white">Community</a>
                                </div>
                            </div>
                        </div>
                    </div>
            </footer>
        );
    }
}

export default Footer;