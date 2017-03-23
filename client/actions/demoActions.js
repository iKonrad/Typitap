import Constants from '../constants/demoConstants';


const Actions = {
    setConfig(config) {
        return { type: Constants.SET_CONFIG, config }
    }
};

export default Actions;