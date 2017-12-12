const router = require('./router');
import { Helmet } from 'react-helmet';
// export main function for server side rendering
import 'utils/icons';

global.main = router.renderToString;

// start app if it in the browser
if(typeof window !== 'undefined') {

  // Start main application here
  router.run();
}