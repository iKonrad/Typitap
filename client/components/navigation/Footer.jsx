import React from 'react';
import { Link } from 'react-router';
import { Follow } from 'react-twitter-widgets'
import FacebookProvider, { Like } from 'react-facebook';

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
                                <div className="margin-top-3 text-center">
                                    <div className="white">made by <a href="http://jarosinski.uk" className="white" target="_blank">Konrad Jarosinski</a></div>
                                </div>
                            </div>
                            <div className="col col-xs-12 col-sm-8 text-center">
                                <div className="text-right margin-top-3">
                                    <Link to="/" className="white" style={{marginRight: "13px"}}>Home</Link>
                                    <Link to="/about" className="white" style={{marginRight: "13px"}}>About</Link>
                                    <Link to="https://blog.typitap.com" className="white" style={{marginRight: "13px"}}>Blog</Link>
                                    <Link to="http://community.typitap.com" className="white" style={{marginRight: "13px"}}>Community</Link>
                                    <Link to="/play" className="white" style={{marginRight: "13px"}}>Play</Link>
                                    <Link to="/terms" className="white" style={{marginRight: "13px"}}>Terms</Link>
                                    <Link to="/privacy" className="white" style={{marginRight: "13px"}}>Privacy</Link>
                                    <a href="http://community.typitap.com" className="white">Community</a>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-xs-12">
                                <div className="footer__social">
                                    <div className="row">
                                        <div className="col col-xs-12 col-md-offset-4 col-md-2">
                                            <Follow username="typitap"></Follow>
                                        </div>
                                        <div className="col col-xs-12 col-md-2 text-left">
                                            <FacebookProvider appId="1776657649242212">
                                                <Like href="http://www.facebook.com/typitap" colorScheme="dark" share />
                                            </FacebookProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </footer>
        );
    }
}

export default Footer;