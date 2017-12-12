'use strict';

let css = require('assets/scss/misc/notifications/styles.scss');

// media breakpoint - small screen min width
let smallScreenMin = 768;

// default className for NotificationsSystem component
let notificationsSystemClassName = css['notifications-system'];

// default className for NotificationsContainer component
let notificationsContainerClassName = {
  main: css['notifications-container'],
  position: function position(_position) {
    return css['notifications-container--' + _position];
  }
};

// default transition for Notification component
let notificationsContainerTransition = {
  enterTimeout: 500,
  leaveTimeout: 900,
  name: {
    enter: css['notification-wrapper-enter'],
    leave: css['notification-wrapper-leave']
  }
};

// default className for Notification component
let notificationClassName = {
  main: css['notification'],
  wrapper: css['notification-wrapper'],
  meta: css['notification-meta'],
  title: css['notification-title'],
  message: css['notification-message'],
  // `fa` corresponds to font-awesome's class name
  icon: "",
  imageContainer: css['notification-image-container'],
  image: css['notification-image'],
  status: function status(_status) {
    return css['notification--' + _status];
  },
  dismissible: css['notification--dismissible'],
  buttons: function buttons(count) {
    if (count === 0) {
      return '';
    } else if (count === 1) {
      return css['notification--buttons-1'];
    } else if (count === 2) {
      return css['notification--buttons-2'];
    }
    return css['notification-buttons'];
  },
  closeButtonContainer: css['notification-close-button-container'],
  closeButton: 'far ' + css['notification-close-button'],
  button: css['notification-button'],
  buttonText: css['notification-button-text']
};

module.exports = {
  smallScreenMin: smallScreenMin,
  notificationsSystem: {
    className: notificationsSystemClassName
  },
  notificationsContainer: {
    className: notificationsContainerClassName,
    transition: notificationsContainerTransition
  },
  notification: {
    className: notificationClassName
  }
};
