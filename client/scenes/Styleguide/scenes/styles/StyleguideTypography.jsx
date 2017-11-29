import React from 'react';

class StyleguideTypography extends React.Component {
    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col mt-2">
                        <h2>Typography</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-2">
                        <h1>h1 - Lorem ipsum dolor sit amet, consectetur.</h1>
                        <h2>h2 - Lorem ipsum dolor sit amet, consectetur.</h2>
                        <h3>h3 - Lorem ipsum dolor sit amet, consectetur.</h3>
                        <h4>h4 - Lorem ipsum dolor sit amet, consectetur.</h4>
                        <h5>h5 - Lorem ipsum dolor sit amet, consectetur.</h5>
                        <h6>h6 - Lorem ipsum dolor sit amet, consectetur.</h6>
                    </div>
                </div>


                <div className="row">
                    <div className="col mt-5 col-md-6">
                        <h3>Body text</h3>

                        <h4>Paragraph</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam doloribus esse fugiat natus, quasi quo totam? Magni nobis porro similique.</p>

                        <h4>Strong</h4>
                        <strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda consequuntur ea enim ipsa neque officia quidem quo reiciendis saepe veritatis.</strong>

                        <h4>Italic</h4>
                        <em>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem est et fugit omnis porro quia rem soluta ut voluptatum. Sed.</em>

                        <h4>Small</h4>
                        <small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ipsum iure magnam nam officia omnis quisquam, recusandae sequi velit veniam?</small>

                        <h4>Code</h4>
                        <code>Lorem ipsum dolor sit amet.</code>
                    </div>
                </div>
            </div>
        );
    }
}

export default StyleguideTypography;