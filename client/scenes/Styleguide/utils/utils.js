export const MENU_TREE = [
    {
        label: 'Overview',
        type: 'link',
        url: '/styleguide'
    },
    {
        label: 'Styles',
        type: 'dropdown',
        url: '#',
        items: [
            {
                label: 'Typography',
                type: 'link',
                url: '/styleguide/styles/typography',
            },
            {
                label: 'Colors',
                type: 'link',
                url: '/styleguide/styles/colors',
            }
        ],
    },
    {
        label: 'Components',
        type: 'dropdown',
        url: '#',
        items: [
            {
                label: 'Form',
                type: 'link',
                url: '/styleguide/components/form',
            },
            {
                label: 'Button',
                type: 'link',
                url: '/styleguide/components/button',
            },
        ],
    },
    {
        label: 'Back to typitap',
        type: 'button',
        url: '/',
    }
];