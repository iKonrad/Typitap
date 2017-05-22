/**
 * Created by konrad on 22/05/2017.
 */
import Notifications from 'react-notification-system-redux';
import {getStore} from 'store/store';

function updateTableField(table, id, property, value, type) {

    const formData = new FormData();

    formData.append("table", table);
    formData.append("id", id);
    formData.append("property", property);
    formData.append("value", value);
    formData.append("type", type);



    return fetch(`/api/admin/update`, {
        credentials: "same-origin",
        method: "POST",
        body: formData,
        headers: {
            "Cookie": global.clientCookies
        }
    }).then((response) => {
        return response.json();
    }).then((response) => {
        if (response.success) {
            getStore().dispatch(Notifications.success({title: "Row updated", message: `${property} saved successfully`}))
        } else {
            getStore().dispatch(Notifications.error({title: "Error occurred", message: `Could not update ${property}.`}))
        }
        return response;
    });


}

export function updateUserField(id, property, value, type = "string") {

    if (type === undefined) {
        type = "string";
    }

    return updateTableField("users", id, property, value, type);
}