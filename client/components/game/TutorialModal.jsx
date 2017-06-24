import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

class TutorialModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            max: 7,
        }
    }

    render() {
        return (
            <Modal show={this.props.open} onHide={ this.props.closeModal }>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="row text-center">
                        <div className="col col-xs-12">
                            { this.renderStep(this.state.page) }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    { this.state.page > 1 ? <button type="button" onClick={ this.previousStep.bind(this) }
                                                    className="btn btn-primary btn-outline btn-sm">
                        Previous</button> : "" }
                    { this.state.page < this.state.max ?
                        <button type="button" onClick={ this.nextStep.bind(this) } className="btn btn-primary btn-sm">
                            Next</button> : "" }
                    { this.state.page === this.state.max ? <button type="button" onClick={ this.handleClose.bind(this) }
                                                                   className="btn btn-primary btn-sm">
                        Done</button> : "" }
                </Modal.Footer>
            </Modal>
        );
    }

    handleClose() {
        let state = this.state;
        state.page = 1;
        this.setState(state);
        this.props.closeModal();
    }


    nextStep() {
        let state = this.state;
        state.page++;
        this.setState(state);
    }

    previousStep() {
        let state = this.state;
        state.page--;
        this.setState(state);
    }

    renderStep(step) {

        let markup = "";
        switch (step) {
            case 1:
                markup = (
                    <div>
                        <h2>Welcome to typitap!</h2>
                        <p>This tutorial will guide you through all aspects of the game</p>
                        <img src="/static/images/seo/og_image.png" width="100%" alt="Typitap logo"/>
                        <p className="margin-top-1">Click on the <strong>next</strong> button to continue</p>
                    </div>
                );
                break;
            case 2:
                markup = (
                    <div>
                        <h2>Game screen</h2>
                        <p>This is the main game screen.</p>
                        <img src="/static/images/pages/tutorial/step1.jpg" width="100%" alt="Typitap logo"/>
                        <p className="margin-top-1">Click on the <strong>next</strong> button to continue</p>
                    </div>
                );
                break;
            case 3:
                markup = (
                    <div>
                        <h2>Game screen</h2>
                        <p>Here shows the text that you will need to re-type.</p>
                        <img src="/static/images/pages/tutorial/step2.jpg" width="100%" alt="Typitap logo"/>
                        <p className="margin-top-1">Click on the <strong>next</strong> button to continue</p>
                    </div>
                );
                break;
            case 4:
                markup = (
                    <div>
                        <h2>Text input</h2>
                        <p>In the text field below, you have to retype the text from the game screen into this text field</p>
                        <img src="/static/images/pages/tutorial/step3.jpg" width="100%" alt="Typitap logo"/>
                        <p className="margin-top-1">Click on the <strong>next</strong> button to continue</p>
                    </div>
                );
                break;
            case 5:
                markup = (
                    <div>
                        <h2>Player progress</h2>
                        <p>Here you can keep an eye on your (and your opponents) progress</p>
                        <img src="/static/images/pages/tutorial/step4.jpg" width="100%" alt="Typitap logo"/>
                        <p className="margin-top-1">Click on the <strong>next</strong> button to continue</p>
                    </div>
                );
                break;
            case 6:
                markup = (
                    <div>
                        <h2>Time & mistakes</h2>
                        <p>This section shows you how many mistakes you have made and how much time have passed.</p>
                        <img src="/static/images/pages/tutorial/step5.jpg" width="100%" alt="Typitap logo"/>
                        <p className="margin-top-1">Click on the <strong>next</strong> button to continue</p>
                    </div>
                );
                break;
            case 7:
                markup = (
                    <div>
                        <h2>Done!</h2>
                        <p>Now you're prepared for your first match. Click on either <strong>Online</strong> or <strong>Practice</strong> buttons and jump straight into action.</p>
                        <img src="/static/images/seo/og_image.png" width="100%" alt="Typitap logo"/>
                    </div>
                );
                break;

        }

        return markup;
    }
}

export default TutorialModal;