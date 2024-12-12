import { DebugItem } from '@typings/events';
import { toggleVisible } from './visibility';
import { Receive, Send } from '@enums/events';
import { DebugEventSend, SendEvent } from '@utils/eventsHandlers';

/**
 * The debug actions that will show up in the debug menu.
 */
const shopDebugData = {
    shopCategory: {
        0: { name: 'Foolds', icon: 'fa-utensils' },
        1: { name: 'Salad', icon: 'fa-bowl-rice' },
        2: { name: 'Drinks', icon: 'fa-glass-water' },
        3: { name: 'Desserts', icon: 'fa-ice-cream' },
        4: { name: 'Specials', icon: 'fa-star' },
        5: { name: 'Appetizers', icon: 'fa-utensils' },
        6: { name: 'Main Course', icon: 'fa-drumstick-bite' },
        7: { name: 'Seafood', icon: 'fa-fish' },
        8: { name: 'Beverages', icon: 'fa-coffee' },
        9: { name: 'Sides', icon: 'fa-carrot' },
    },
    shopName: 'Pearls',
    shopImage: './images/pearls.png',
    shopDescription: 'Welcome to Pearls, how can we help you today?',
    shopInventoryImage: 'nui://ox_inventory/web/images/',
    shopItems: {
        gourmet_double_burger: {
            id: 'gourmet_double_burger',
            name: 'Gourmet Double Burger',
            price: 500,
            stock: 500,
            page: 0,
        },
        dom_perignon: {
            id: 'dom_perignon',
            name: 'Dom Perignon',
            price: 500,
            stock: 500,
            page: 2,
        },
        steak_and_lobster_meal: {
            id: 'steak_and_lobster_meal',
            name: 'Steak & Lobster Meal',
            price: 500,
            stock: 500,
            page: 0,
        },
        oysters_half_shell: {
            id: 'oysters_half_shell',
            name: 'Oysters Half Shell',
            price: 500,
            stock: 500,
            page: 0,
        },
        crab_legs_meal: {
            id: 'crab_legs_meal',
            name: 'Crab Legs Meal',
            price: 500,
            stock: 500,
            page: 0,
        },
        tropical_chicken_salad: {
            id: 'tropical_chicken_salad',
            name: 'Tropical Chicken Salad',
            price: 500,
            stock: 500,
            page: 1,
        },
        side_caesar_salad: {
            id: 'side_caesar_salad',
            name: 'Side Caesar Salad',
            price: 500,
            stock: 500,
            page: 1,
        },
        ps_dr_pepper: {
            id: 'ps_dr_pepper',
            name: 'Dr Pepper',
            price: 500,
            stock: 500,
            page: 2,
        },
        tilapia_fish_meal: {
            id: 'tilapia_fish_meal',
            name: 'Tilapia Fish Meal',
            price: 500,
            stock: 500,
            page: 0,
        },
        shrimp_and_crab_dip: {
            id: 'shrimp_and_crab_dip',
            name: 'Shrimp & Crab Dip',
            price: 500,
            stock: 500,
            page: 0,
        },
        fried_scallops: {
            id: 'fried_scallops',
            name: 'Fried Scallops',
            price: 500,
            stock: 500,
            page: 0,
        },
        crab_cakes: { id: 'crab_cakes', name: 'Crab Cakes', price: 500, stock: 500, page: 0 },
        patron_margarita: {
            id: 'patron_margarita',
            name: 'Patron Margarita',
            price: 500,
            stock: 500,
            page: 2,
        },
        shrimp_alfredo: {
            id: 'shrimp_alfredo',
            name: 'Shrimp Alfredo',
            price: 500,
            stock: 500,
            page: 0,
        },
        glazed_salmon: {
            id: 'glazed_salmon',
            name: 'Glazed Salmon',
            price: 500,
            stock: 500,
            page: 0,
        },
        hennessy_shot: {
            id: 'hennessy_shot',
            name: 'Hennessy Shot',
            price: 500,
            stock: 500,
            page: 2,
        },
        upeel_shrimp: {
            id: 'upeel_shrimp',
            name: 'U-Peel Shrimp',
            price: 500,
            stock: 500,
            page: 0,
        },
        baby_lobster_pasta: {
            id: 'baby_lobster_pasta',
            name: 'Baby Lobster Pasta',
            price: 500,
            stock: 500,
            page: 0,
        },
        chicken_caesar_salad: {
            id: 'chicken_caesar_salad',
            name: 'Chicken Caesar Salad',
            price: 500,
            stock: 500,
            page: 1,
        },
        catfish: { id: 'catfish', name: 'Catfish', price: 500, stock: 500, page: 0 },
        salmon_caesar_salad: {
            id: 'salmon_caesar_salad',
            name: 'Salmon Caesar Salad',
            price: 500,
            stock: 500,
            page: 1,
        },
        shrimp_pasta: {
            id: 'shrimp_pasta',
            name: 'Shrimp Pasta',
            price: 500,
            stock: 500,
            page: 0,
        },
        ps_coca_cola: {
            id: 'ps_coca_cola',
            name: 'Ccoca Cola',
            price: 500,
            stock: 500,
            page: 2,
        },
        pearls_coffee: {
            id: 'pearls_coffee',
            name: 'Pearls Coffee',
            price: 500,
            stock: 500,
            page: 2,
        },
        ps_sprite: { id: 'ps_sprite', name: 'Sprite', price: 500, stock: 500, page: 2 },
        lobster_bisque: {
            id: 'lobster_bisque',
            name: 'Lobster Bisque',
            price: 500,
            stock: 500,
            page: 0,
        },
        shells_clam_chowder: {
            id: 'shells_clam_chowder',
            name: 'Shells Clam Chowder',
            price: 500,
            stock: 500,
            page: 0,
        },
        fried_mushrooms: {
            id: 'fried_mushrooms',
            name: 'Fried Mushrooms',
            price: 500,
            stock: 500,
            page: 0,
        },
    },
};

const SendDebuggers: DebugItem[] = [
    {
        label: 'Visibility',
        actions: [
            {
                label: 'Show',
                action: () => DebugEventSend(Receive.visible, shopDebugData),
            },
            {
                label: 'Hide',
                action: () => DebugEventSend(Receive.visible, false),
            },
        ],
    },
    {
        label: 'Slider',
        actions: [
            {
                label: 'Change Value',
                action: (value: number) =>
                    DebugEventSend(Send.imageResize, value),
                value: 50,
                type: 'slider',
            },
        ],
    },
    {
        label: 'Checkbox',
        actions: [
            {
                label: 'Toggle',
                action: (value: number) =>
                    DebugEventSend(Send.imageInvert, value),
                value: false,
                type: 'checkbox',
            },
        ],
    },
    {
        label: 'Text',
        actions: [
            {
                label: 'Type',
                action: (value: string) =>
                    DebugEventSend(Send.changeText, value),
                type: 'text',
                placeholder: 'Type here',
            },
        ],
    },
    {
        label: 'Button',
        actions: [
            {
                label: 'Reset Text',
                action: () => DebugEventSend(Send.resetText),
            },
        ],
    },

    {
        label: 'Debug receiver example.',
        actions: [
            {
                label: 'Emulates a POST To Client and get back a response.',
                type: 'text',
                placeholder: 'Type text to reverse.',
                action: (value: string) =>
                    SendEvent('debug', value).then((reversed: string) =>
                        console.log(
                            reversed,
                            'color: red',
                            'color: white',
                            'color: green',
                        ),
                    ),
            },
        ],
    },
];

export default SendDebuggers;
