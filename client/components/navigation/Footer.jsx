import React from 'react';
import { Link } from 'react-router';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer id="footer" className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12 col-sm-4">
                                <div className="margin-top-2">
                                    <img src="static/images/identity/typitap-logo-white.png" />
                                    <div className="white">by <a href="http://jarosinski.uk" className="white" target="_blank">Konrad Jarosinski</a></div>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-8">
                                <div className="text-right margin-top-4">
                                    <Link to="/" className="white" style={{marginRight: "13px"}}>Home</Link>
                                    <Link to="/play" className="white" style={{marginRight: "13px"}}>Play</Link>
                                    <Link to="/about" className="white" style={{marginRight: "13px"}}>About</Link>
                                    <Link to="/play" className="white" style={{marginRight: "13px"}}>Play</Link>
                                    <Link to="/terms" className="white" style={{marginRight: "13px"}}>Terms</Link>
                                    <Link to="/privacy" className="white" style={{marginRight: "13px"}}>Privacy</Link>
                                    <Link to="/contact" className="white" style={{marginRight: "13px"}}>Contact</Link>
                                    <Link to="/blog" className="white">Blog</Link>
                                </div>
                            </div>
                        </div>

                    </div>
            </footer>
        );
    }
}

export default Footer;