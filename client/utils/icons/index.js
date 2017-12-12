import fontawesome from '@fortawesome/fontawesome';
import regularIcons from './regular';
import brandIcons from './brands';
import solidIcons from './solid';

regularIcons.forEach((item) => fontawesome.library.add(item))
brandIcons.forEach((item) => fontawesome.library.add(item))
solidIcons.forEach((item) => fontawesome.library.add(item))

fontawesome.config = {
    autoAddCss: false,
    searchPseudoElements: true
}

require('@fortawesome/fontawesome/styles.css');