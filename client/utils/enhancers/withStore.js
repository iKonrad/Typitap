import {withContext} from 'recompose';

export default provide = store => withContext( { store }, () => ({store}))