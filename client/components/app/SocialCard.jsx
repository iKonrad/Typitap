import React from 'react';
import Card from 'components/app/Card';

class SocialCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card title="Social stuff" loaded={true}>
                <div className="mt-2">
                    <div className="row">
                        <div className="col mt-2">
                            <a target="_blank" href="https://www.facebook.com/typitap" className="btn btn-facebook btn-block">Like us on Facebook</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mt-2">
                            <a target="_blank" href="https://twitter.com/typitap" className="btn btn-twitter btn-block">Follow us on Twitter</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mt-2">
                            <a target="_blank" href="https://plus.google.com/b/115496080103251519478/115496080103251519478" className="btn btn-google-plus btn-block">Find us on Google+</a>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default SocialCard;