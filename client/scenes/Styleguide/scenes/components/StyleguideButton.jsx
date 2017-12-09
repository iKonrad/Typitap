import React from 'react';

class StyleguideButton extends React.Component {
    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col mt-2">
                        <h2>Buttons</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-2">
                        <h4>Regular Buttons</h4>
                        <p>
                            <a href="#" className="btn btn-primary">Test</a>
                            <a href="#" className="btn btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-2">
                        <h4>Outline Buttons</h4>
                        <p>
                            <a href="#" className="btn btn-outline btn-primary">Test</a>
                            <a href="#" className="btn btn-outline btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className="col mt-2">
                        <h4>Small Buttons</h4>
                        <p>
                            <a href="#" className="btn btn-sm btn-primary">Test</a>
                            <a href="#" className="btn btn-sm btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-sm btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-sm btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-sm btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-sm btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                        <p>
                            <a href="#" className="btn btn-outline btn-sm btn-primary">Test</a>
                            <a href="#" className="btn btn-outline btn-sm btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-sm btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-sm btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-sm btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-sm btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                        <p>
                            <a href="#" className="btn btn-xs btn-primary">Test</a>
                            <a href="#" className="btn btn-xs btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-xs btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-xs btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-xs btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-xs btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                        <p>
                            <a href="#" className="btn btn-outline btn-xs btn-primary">Test</a>
                            <a href="#" className="btn btn-outline btn-xs btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-xs btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-xs btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-xs btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-outline btn-xs btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className="col mt-2">
                        <h4>Link Button</h4>
                        <p>
                            <a href="#" className="btn btn-link btn-primary">Test</a>
                            <a href="#" className="btn btn-link btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                        <p>
                            <a href="#" className="btn btn-link btn-sm btn-primary">Test</a>
                            <a href="#" className="btn btn-link btn-sm btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-sm btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-sm btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-sm btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-sm btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                        <p>
                            <a href="#" className="btn btn-link btn-xs btn-primary">Test</a>
                            <a href="#" className="btn btn-link btn-xs btn-secondary" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-xs btn-info" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-xs btn-success" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-xs btn-warning" style={{marginLeft: "10px"}}>Test</a>
                            <a href="#" className="btn btn-link btn-xs btn-danger" style={{marginLeft: "10px"}}>Test</a>
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className="col mt-2">
                        <h4>Circle Button</h4>
                        <p>
                            <a href="#" className="btn btn-circle btn-primary"><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-secondary" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-info" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-success" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-warning" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-danger" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                        </p>
                        <p>
                            <a href="#" className="btn btn-circle btn-outline btn-primary"><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-outline btn-secondary" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-outline btn-info" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-outline btn-success" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-outline btn-warning" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                            <a href="#" className="btn btn-circle btn-outline btn-danger" style={{marginLeft: "10px"}}><i className="fa fa-heart"></i></a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default StyleguideButton;