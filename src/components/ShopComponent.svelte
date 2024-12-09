<script lang="ts">
    import { ReceiveEvent, SendEvent } from '@utils/eventsHandlers';
    import { Receive, Send } from '@enums/events';
    import { SHOPDATA } from '@stores/stores';
    import { get } from 'svelte/store';
    import { dummyShopData } from '@utils/dummyData';

    // let shopData = get(SHOPDATA);
    let shopData = dummyShopData;
    let selectedCategory: any = 'All';
    let filteredItems: any[] = [];
    let cart: any[] = [];

    function filterItems(category: any) {
        selectedCategory = category;
        filteredItems =
            category === 'All'
                ? Object.values(shopData.shopItems)
                : Object.values(shopData.shopItems).filter(
                      item => item.page === category,
                  );
    }

    function addToCart(item) {
        const existingItemIndex = cart.findIndex(
            cartItem => cartItem.name === item.name,
        );
        if (existingItemIndex !== -1) {
            cart = cart.map((cartItem, index) => {
                if (index === existingItemIndex) {
                    const updatedItem = {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                        totalPrice: (cartItem.quantity + 1) * cartItem.price,
                    };
                    return updatedItem;
                }
                return cartItem;
            });
        } else {
            cart = [...cart, { ...item, quantity: 1, totalPrice: item.price }];
        }
    }

    function incrementQuantity(item) {
        cart = cart.map(cartItem => {
            if (cartItem.name === item.name) {
                return {
                    ...cartItem,
                    quantity: cartItem.quantity + 1,
                    totalPrice: (cartItem.quantity + 1) * cartItem.price,
                };
            }
            return cartItem;
        });
    }

    function decrementQuantity(item) {
        cart = cart.reduce((acc, cartItem) => {
            if (cartItem.name === item.name) {
                if (cartItem.quantity > 1) {
                    acc.push({
                        ...cartItem,
                        quantity: cartItem.quantity - 1,
                        totalPrice: (cartItem.quantity - 1) * cartItem.price,
                    });
                }
            } else {
                acc.push(cartItem);
            }
            return acc;
        }, []);
    }

    function clearCart() {
        cart = [];
    }

    function totalPrice() {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    }

    function handleWheel(event) {
        const container = event.currentTarget;
        container.scrollLeft += event.deltaY;
    }

    function buyCartItems() {
        SendEvent(Send.buyItem, cart);
    }

    // Initialize filteredItems with all items
    filteredItems = Object.values(shopData.shopItems);
</script>

<!-- ShopComponent -->
<div class="flex flex-col md:flex-row justify-between h-full w-full">
    <!-- Main Content (Items + Categories) -->
    <div class="w-full md:w-6/8">
        <!-- Categories and Items -->
        <div class="flex flex-col">
            <!-- Categories -->
            <div
                class="category-scrollbar flex gap-2 mb-4"
                on:wheel={handleWheel}
            >
                <button
                    class:selected={selectedCategory === 'All'}
                    on:click={() => filterItems('All')}
                >
                    <span>All</span>
                </button>
                {#each Object.values(shopData.shopCategory) as category}
                    <button
                        class:selected={selectedCategory === category.name}
                        on:click={() => filterItems(category.name)}
                    >
                        <span>{category.name}</span>
                    </button>
                {/each}
            </div>

            <!-- Items -->
            <div class="item-scrollbar grid grid-cols-3 gap-2">
                {#each filteredItems as item}
                    <div class="item-card">
                        <div
                            class="item-details flex flex-col justify-between h-full"
                        >
                            <div>
                                <h3 class="text-lg text-gray-100 font-semibold">
                                    {item.name}
                                </h3>
                                <p class="text-gray-600 text-sm">
                                    {shopData.shopCategory[item.page].name}
                                </p>
                                {#if item.stock > 0}
                                    <p class="text-gray-500 text-sm">
                                        Stock: {item.stock}
                                    </p>
                                {:else}
                                    <p class="text-red-500 text-sm">
                                        Out of stock
                                    </p>
                                {/if}
                            </div>
                            <button
                                class="mt-2 px-2 bg-blue-500 text-white text-sm rounded self-start"
                                on:click={() => addToCart(item)}
                                disabled={item.stock === 0}
                            >
                                ${item.price}
                            </button>
                        </div>
                        <img
                            src="/public/images/dummyImage.png"
                            alt={item.name}
                            class="item-image"
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Cart Section -->
    <div class="w-full md:w-2/6 mt-4 md:mt-0 md:pl-4">
        <div class="flex flex-col items-center">
            <!-- src={shopData?.shopLogo} -->
            <img
                src={'/images/TextBlack.png'}
                alt="images not found"
                class="w-28 h-28 mb-1"
            />
            <h3 class="text-lg text-center text-gray-700 font-semibold">
                {shopData.shopName}
            </h3>
            <p class="text-center text-gray-600 mt-1 text-sm">
                {shopData.shopDescription}
            </p>
        </div>
        <!-- Cart -->
        <div class="mt-2">
            <h4 class="text-base text-center text-gray-600 font-semibold mb-2">
                Shopping Cart
            </h4>
            <div class="cart border p-1 rounded">
                {#if cart.length === 0}
                    <p class="text-red-600 text-sm text-center font-semibold">
                        Cart is empty
                    </p>
                {:else}
                    <ul>
                        {#each cart as item}
                            <li class="cart-item text-gray-800 text-sm">
                                <button
                                    class="px-2 bg-blue-300 rounded mr-2"
                                    on:click={() => decrementQuantity(item)}
                                    >-</button
                                >
                                <span class="flex-1 text-left">{item.name}</span
                                >
                                <span
                                    >{item.quantity > 1
                                        ? `${item.quantity}x `
                                        : ''}{item.price}$</span
                                >
                                <button
                                    class="px-2 bg-blue-300 rounded ml-2"
                                    on:click={() => incrementQuantity(item)}
                                    >+</button
                                >
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
            <!-- Total Price -->
            <div class="flex justify-between mt-4">
                <span class="text-lg text-gray-500 font-semibold">Total</span>
                <span class="text-lg text-red-600 font-semibold"
                    >${totalPrice()}</span
                >
            </div>
            <!-- Pay and Clear Buttons -->
            <div class="flex justify-between mt-4">
                <button
                    class="flex-1 px-4 text-lg bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                    on:click={buyCartItems}>PAY</button
                >
                <button
                    class="flex-1 px-4 text-lg bg-red-500 hover:bg-red-600 text-white rounded ml-2"
                    on:click={clearCart}>CLEAR</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .selected {
        background-color: #91a8ee;
    }
    .cart {
        height: 135px; /* Set a fixed height */
        overflow-y: auto; /* Enable vertical scrolling */
    }
    .cart::-webkit-scrollbar {
        width: 1px; /* Set the width of the scrollbar */
    }
    .cart::-webkit-scrollbar-thumb {
        background-color: #91a8ee; /* Set the color of the scrollbar thumb */
        border-radius: 4px; /* Set the border radius of the scrollbar thumb */
    }
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e5e7eb;
        padding: 2px;
        border-radius: 4px;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }
    .cart-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .category-scrollbar {
        overflow-x: auto;
        white-space: nowrap;
        width: 455px;
        scroll-behavior: smooth; /* Enable smooth scrolling */
    }
    .category-scrollbar::-webkit-scrollbar {
        height: 4px; /* Set the height of the scrollbar */
    }
    .category-scrollbar::-webkit-scrollbar-thumb {
        background-color: #ccc; /* Set the color of the scrollbar thumb */
        border-radius: 4px; /* Set the border radius of the scrollbar thumb */
    }
    .item-scrollbar {
        overflow-y: auto;
        height: 300px;
    }
    .item-scrollbar::-webkit-scrollbar {
        width: 4px; /* Set the width of the scrollbar */
    }
    .item-scrollbar::-webkit-scrollbar-thumb {
        background-color: #ccc; /* Set the color of the scrollbar thumb */
        border-radius: 4px; /* Set the border radius of the scrollbar thumb */
    }
    .item-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* border: 1px solid #e5e7eb; */
        padding: 5px;
        border-radius: 8px;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        /* height: 75px; */
        background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 0.2)
        );
    }
    .item-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .item-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .item-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }
    .category-scrollbar > button {
        font-family: PFDinDisplayPro;
        background-color: #040404ad;
        color: rgba(255, 255, 255, 0.55);
        text-transform: uppercase;
        font-size: 11px;
        border-bottom: 1.5px solid;
        margin: 0% 0.5%;
        transition: 0.8s ease-in-out;
        /* -webkit-transition: 0.8s ease-in-out; */
        text-align: center;
        line-height: normal;
        padding: 4px 16px;
        border-radius: 5px;
    }
    .category-scrollbar > button:hover {
        background: linear-gradient(
            0deg,
            rgb(112 155 110) 0%,
            rgb(88 111 86) 45.05%,
            rgb(0 0 0 / 71%) 74.14%
        );
        border-bottom: 1.5px solid rgb(116 185 110);
        border-radius: 25px;
    }
    .category-scrollbar > button:hover > span {
        border-top: 1px solid rgb(116 185 110);
    }
</style>
