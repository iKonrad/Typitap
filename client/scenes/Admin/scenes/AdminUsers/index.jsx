import React from 'react';
import ReactTable from 'react-table'
import * as tableUtils from 'utils/tableUtils';

class AdminUsers extends React.Component {
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
                Cell: tableUtils.renderAdminEditableField.bind(this),
                type: "string",
            }, {
                Header: 'Name',
                accessor: 'name',
                Cell: tableUtils.renderAdminEditableField.bind(this)
            }, {
                Header: 'E-mail',
                accessor: "email",
                Cell: tableUtils.renderAdminEditableField.bind(this)
            }, {
                Header: "Active",
                accessor: 'active',
                Cell: tableUtils.renderAdminEditableField.bind(this),
                type: "bool"
            }, {
                Header: "Created",
                accessor: 'created',
            }, {
                Header: "Role",
                accessor: "role",
                Cell: tableUtils.renderAdminEditableField.bind(this)
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
                if (response.data !== undefined && response.data !== null) {
                    let state = this.state;
                    state.data = response.data;
                    this.setState(state);
                }
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


export default AdminUsers;