import * as AdminActions from 'scenes/Admin/utils/adminActions';
import React from 'react';

export function renderAdminEditableField(cellInfo) {
    let type = cellInfo.column.type === undefined ? "string" : cellInfo.column.type;
    return (
        <div style={{backgroundColor: '#fafafa'}} contentEditable suppressContentEditableWarning onBlur={(e) => {

            let id = this.state.data[cellInfo.index]["id"];
            let property = cellInfo.column.id;
            let value = e.target.textContent;

            if (this.state.data[cellInfo.index][property] === value) {
                return;
            }

            AdminActions.updateUserField(id, property, value, type).then((response) => {
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