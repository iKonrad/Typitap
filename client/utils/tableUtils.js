import * as AdminActions from 'scenes/Admin/utils/adminActions';
import React from 'react';

export function renderAdminEditableField(table, cellInfo) {
    let type = cellInfo.column.type === undefined ? "string" : cellInfo.column.type;
    return (
        <div style={{backgroundColor: '#fafafa'}} contentEditable suppressContentEditableWarning onBlur={(e) => {

            let id = "";
            if (this.state.data[cellInfo.index]["id"] !== undefined) {
                id = this.state.data[cellInfo.index]["id"];
            }

            if (this.state.data[cellInfo.index]["Id"] !== undefined) {
                id = this.state.data[cellInfo.index]["Id"];
            }

            if (id === "" && this.state.data[cellInfo.index]["Level"] !== undefined) {
                id = this.state.data[cellInfo.index]["Level"];
            }

            let property = cellInfo.column.id.toLowerCase();
            let value = e.target.textContent;

            if (this.state.data[cellInfo.index][property] === value) {
                return;
            }

            AdminActions.updateTableField(table, id, property, value, type).then((response) => {
                if (response.success) {
                    // Update state
                    const data = [...this.state.data];
                    data[cellInfo.index][property] = type !== "bool" ? value : value ? "yes" : "no";
                    this.setState({data: data});
                }
            });

        }}>
            { type !== "bool" ? this.state.data[cellInfo.index][cellInfo.column.id] : cellInfo.value ? "yes" : "no"}
        </div>
    )
}