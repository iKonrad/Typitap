import React from 'react';
import ReactTable from 'react-table'
import * as tableUtils from 'utils/tableUtils';

class AdminUsers extends React.Component {

    static clientInit({store, nextState, replaceState, callback}) {
        callback();
    }

    constructor(props) {
        super(props);


        this.state = {
            data: [],
            columns: [{
                Header: 'ID',
                accessor: 'id', // String-based value accessors!
            }, {
                Header: 'Username',
                accessor: 'username',
                Cell: tableUtils.renderAdminEditableField.bind(this, "users"),
                type: "string",
            }, {
                Header: 'Name',
                accessor: 'name',
                Cell: tableUtils.renderAdminEditableField.bind(this, "users")
            }, {
                Header: 'E-mail',
                accessor: "email",
                Cell: tableUtils.renderAdminEditableField.bind(this, "users")
            }, {
                Header: "Active",
                accessor: 'active',
                Cell: tableUtils.renderAdminEditableField.bind(this, "users"),
                type: "bool"
            }, {
                Header: "Created",
                accessor: 'created',
            }, {
                Header: "Role",
                accessor: "role",
                Cell: tableUtils.renderAdminEditableField.bind(this, "users")
            }, {
                Header: "Actions",
                Cell: props => (<a className="btn btn-default btn-xs">Lol</a>),
            }],
        }
    }

    componentWillMount() {


        fetch(`/api/admin/users`, {
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
                <div className="text-center mt-5">
                    Loading data...
                </div>
            );
        }

    }

    render() {
        return (
            <div>
                <h1>Users</h1>
                { this.renderTable() }
            </div>
        )
    }
}


export default AdminUsers;