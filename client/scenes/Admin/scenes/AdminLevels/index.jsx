import React from 'react';
import ReactTable from 'react-table'
import * as tableUtils from 'utils/tableUtils';

class AdminLevels extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    handleAddNew() {

    }

    constructor(props) {
        super(props);


        this.state = {
            data: [],
            columns: [{
                Header: 'Level',
                accessor: 'Level', // String-based value accessors!
            }, {
                Header: 'Name',
                accessor: 'Name',
                Cell: tableUtils.renderAdminEditableField.bind(this, "levels"),
                type: "string",
            }, {
                Header: 'Icon',
                accessor: 'Icon',
                Cell: tableUtils.renderAdminEditableField.bind(this, "levels")
            }, {
                Header: "Actions",
                Cell: props => (<a className="btn btn-default btn-xs">Lol</a>),
            }],
        }
    }

    componentWillMount() {

        fetch(`/api/admin/levels`, {
            credentials: "same-origin",
            headers: {
                "Cookie": global.clientCookies
            }
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.success) {
                console.log("RES", response);
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


export default AdminLevels;