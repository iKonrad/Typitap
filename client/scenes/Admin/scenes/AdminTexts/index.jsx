import React from 'react';
import ReactTable from 'react-table'
import * as tableUtils from 'utils/tableUtils';
import { push } from "react-router-redux";
import {connect} from "react-redux";
import { Link } from 'react-router';
import Spinner from 'components/app/Spinner';

class AdminTexts extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    openText() {

    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [{
                Header: 'ID',
                accessor: 'Id', // String-based value accessors!
                maxWidth: 200,
            }, {
                Header: 'Text',
                accessor: 'Text',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "string",
                editable: false,
            }, {
                Header: 'Status',
                accessor: 'Status',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "int",
                editable: false,
                maxWidth: 50,
            }, {
                Header: 'Source',
                accessor: 'Source',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "string",
                editable: false,
                maxWidth: 50,
            }, {
                Header: 'Submitted',
                accessor: 'IsSubmitted',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "bool",
                editable: false,
                maxWidth: 50,
            }, {
                Header: 'Language',
                accessor: 'Language',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "string",
                editable: false,
                maxWidth: 50,
            }, {
                Header: 'Actions',
                Cell: tableUtils.renderEditButton.bind(this, "/admin/texts/"),
                maxWidth: 80,
            }
            ],
        }
    }

    componentDidMount() {
        fetch(`/api/admin/texts`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                let state = this.state;
                response.data = response.data.map((obj) => {
                    obj.Language = obj.Language.Id;
                    return obj;
                });
                if (response.data !== undefined && response.data !== null) {
                    state.data = response.data;
                } else {
                    state.data = [];
                }
                this.setState(state);
            }
        });
    }



    renderTable() {
        if (this.state.data.length > 0) {
            return (
                <ReactTable data={this.state.data} columns={this.state.columns} filterable={true} />
            );
        } else {
            return (
                <div className="text-center mt-5">
                    <Spinner />
                </div>
            );
        }

    }

    render() {
        return (
            <div>
                <h1>Texts</h1>
                <div className="row">
                    <div className="col-12 mb-2">
                        <Link to="/admin/texts/new" className="btn btn-circle btn-pink"><i className="fa fa-plus text-white white"></i></Link>
                    </div>
                </div>
                { this.renderTable() }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps)(AdminTexts)