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
        url: '/dashboard',
        authenticated: true,
    },
    {
        label: 'Blog',
        type: 'href',
        url: 'https://blog.typitap.com',
    },
    {
        label: '%%Name%%',
        type: 'dropdown',
        url: '#',
        authenticated: true,
        items: [
            {
                label: 'Submit text',
                type: 'link',
                url: '/submit-text',
            },
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
        label: 'Game Lobby',
        type: 'button',
        url: '/',
    },
];