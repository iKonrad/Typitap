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
                            <div className="col-12 col-sm-6 col-md-3 text-center" style={{minHeight: "150px"}}>
                                <div className="row">
                                    <div className="col">
                                        <div className="text-center" style={{marginTop: "105px"}}>
                                            <img src="/static/images/identity/typitap-logo-white@1.25x.png" />
                                            <div className="white mt-2">Made by <a href="http://jarosinski.uk" className="white" target="_blank">Konrad Jarosinski</a> © 2017</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 text-center" style={{minHeight: "150px"}}>
                                <div style={{marginTop: "120px"}}>
                                    <a target="_blank" style={{marginLeft: "10px"}} href="https://www.facebook.com/typitap" className="btn btn-white btn-outline btn-circle"><i className="fa fa-facebook"></i></a>
                                    <a target="_blank" style={{marginLeft: "10px"}} href="https://twitter.com/typitap" className="btn btn-white btn-outline btn-circle"><i className="fa fa-twitter"></i></a>
                                    <a target="_blank" style={{marginLeft: "10px"}} href="https://plus.google.com/b/115496080103251519478/115496080103251519478" className="btn btn-white btn-outline btn-circle"><i className="fa fa-google-plus"></i></a>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 text-center" style={{minHeight: "150px"}}>
                                <div className="mt-4">
                                    <Link to="/" className="btn btn-link btn-white btn-block mt-4">Home</Link>
                                    <Link to="/about" className="btn btn-link btn-white btn-block mt-1">About</Link>
                                    <a href="https://blog.typitap.com" className="btn btn-link btn-white btn-block mt-1">Blog</a>
                                    <a href="http://community.typitap.com" className="btn btn-link btn-white btn-block mt-1">Community</a>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 text-center" style={{minHeight: "150px"}}>
                                <div className="text-right mt-4">
                                    <Link to="/login" className="btn btn-link btn-white btn-block mt-4">Log in</Link>
                                    <Link to="/faq" className="btn btn-link btn-white btn-block mt-1">FAQ</Link>
                                    <Link to="/submit-text" className="btn btn-link btn-white btn-block mt-1">Submit text</Link>
                                </div>
                            </div>
                        </div>
                    </div>
            </footer>
        );
    }
}

export default Footer;