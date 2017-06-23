const router = require('./router');
import { Helmet } from 'react-helmet';
// export main function for server side rendering

global.main = router.renderToString;

// start app if it in the browser
if(typeof window !== 'undefined') {

  // Start main application here
  router.run();
} else {
    const helmet = Helmet.renderStatic();
    console.log(JSON.stringify(helmet));
}
