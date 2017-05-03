import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap-modal';


class WaitPlayersModal extends Component {

    getInitialState() {
        return {
            open: true
        }
    }

    render() {
        let closeModal = () => this.setState({open: false})

        let saveAndClose = () => {
            this.setState({open: false});
        };

        return (
            <div>
                <button type='button'>Launch modal</button>

                <Modal
                    show={this.state.open}
                    onHide={closeModal}
                    aria-labelledby="ModalHeader">
                    <Modal.Header closeButton>
                        <Modal.Title id='ModalHeader'>A Title Goes here</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Some Content here</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
                        <button className='btn btn-primary' onClick={saveAndClose}>
                            Save
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

export default connect(mapStateToProps)(WaitPlayersModal);