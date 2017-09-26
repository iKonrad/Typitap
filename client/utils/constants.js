export const MENU_TREE = [
    {
        label: 'Log in',
        type: 'link',
        url: '/login',
        authenticated: false
    },
    {
        label: 'Sign up',
        type: 'link',
        url: '/signup',
        authenticated: false
    },
    {
        label: 'My dashboard',
        type: 'link',
        url: '/',
        authenticated: true,
    },
    {
        label: 'Community',
        type: 'href',
        url: 'http://community.typitap.com',
        authenticated: false,
    },
    {
        label: 'Community',
        type: 'href',
        url: 'http://community.typitap.com',
        authenticated: true,
    },
    {
        label: '%%Name%%',
        type: 'dropdown',
        url: '#',
        authenticated: true,
        items: [
            {
                label: 'Settings',
                type: 'link',
                url: '/account/details',
                authenticated: true
            },
            {
                label: 'Log out',
                type: 'logout',
                url: '/auth/logout',
                authenticated: true
            },
        ]
    },
    {
        label: 'Play',
        type: 'button',
        url: '/play',
        authenticated: false
    },
    {
        label: 'Play',
        type: 'button',
        url: '/play',
        authenticated: true
    },
];