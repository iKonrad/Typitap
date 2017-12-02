import react from 'react';
import {compose} from 'recompose';

export default onlyGuests = (store) => WrapperComponent =>
    class extends react.Component {
        render() {
            if (store.getState().user.loggedIn) {
                return <Component/>;
            }

            return "";
        }
    }