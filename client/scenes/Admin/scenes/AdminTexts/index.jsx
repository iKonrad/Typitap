import React from 'react';
import ReactTable from 'react-table'
import * as tableUtils from 'utils/tableUtils';

class AdminTexts extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    constructor(props) {
        super(props);


        this.state = {
            data: [],
            columns: [{
                Header: 'ID',
                accessor: 'Id', // String-based value accessors!
            }, {
                Header: 'Text',
                accessor: 'Text',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "string",
            }, {
                Header: 'Disabled',
                accessor: 'Disabled',
                Cell: tableUtils.renderAdminEditableField.bind(this, "game_texts"),
                type: "bool",
            }
            ],
        }
    }

    componentWillMount() {


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
                <div className="text-center margin-top-5">
                    Loading data...
                </div>
            );
        }

    }

    render() {
        return (
            <div>
                { this.renderTable() }
            </div>
        )
    }
}


export default AdminTexts;