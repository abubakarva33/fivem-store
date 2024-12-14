<script lang="ts">
    import { SendEvent } from '@utils/eventsHandlers';
    import { Send } from '@enums/events';
    import { SHOPDATA } from '@stores/stores';
    import { get } from 'svelte/store';
    import { flip } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';

    let shopData = get(SHOPDATA);
    let selectedCategory: any = 'All';
    let filteredItems: any[] = [];
    let visuallyShuffledItems: any[] = [];
    let cart: any[] = [];
    let isModalVisible = false;

    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function filterItems(category: string) {
        selectedCategory = category;

        if (shopData?.shopItems) {
            const newFilteredItems =
                category === 'All'
                    ? Object.values(shopData.shopItems)
                    : Object.values(shopData.shopItems).filter(
                          item =>
                              shopData.shopCategory[item.page]?.name ===
                              category,
                      );

            // Set actual filtered items
            filteredItems = newFilteredItems;

            // Apply the shuffle effect temporarily
            setTimeout(() => {
                const shuffledItems = shuffleArray([...newFilteredItems]);
                visuallyShuffledItems = [...shuffledItems]; // Temporary shuffled state

                // Revert back to the actual filtered items after animation
                setTimeout(() => {
                    visuallyShuffledItems = [...filteredItems];
                }, 0); // Match animation duration
            }, 0);
        } else {
            filteredItems = [];
            visuallyShuffledItems = [];
        }
    }

    // function filterItems(category: string) {
    //     selectedCategory = category;

    //     if (shopData?.shopItems) {
    //         // Filter items directly without shuffling
    //         filteredItems = category === 'All'
    //             ? Object.values(shopData.shopItems)
    //             : Object.values(shopData.shopItems).filter(
    //                 item => shopData.shopCategory[item.page]?.name === category
    //             );

    //         // Update visual items without animation delay
    //         visuallyShuffledItems = filteredItems;
    //     } else {
    //         filteredItems = [];
    //         visuallyShuffledItems = [];
    //     }
    // }

    function addToCart(item: any) {
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

    function incrementQuantity(item: any) {
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

    function decrementQuantity(item: any) {
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

    function handleWheel(event: WheelEvent) {
        const container = event.currentTarget;
        container.scrollLeft += event.deltaY;
    }

    function openModal() {
        isModalVisible = true;
    }

    function closeModal() {
        isModalVisible = false;
    }

    function payWithCard() {
        const total = totalPrice();
        SendEvent(Send.buyItem, { total: total, items: cart, method: 'bank' });
        closeModal();
    }

    function payWithCash() {
        const total = totalPrice();
        SendEvent(Send.buyItem, { total: total, items: cart, method: 'cash' });
        closeModal();
    }

    filteredItems = Object.values(shopData.shopItems);
    visuallyShuffledItems = Object.values(shopData.shopItems);
</script>

<!-- ShopComponent -->
<div class="flex flex-col md:flex-row justify-between h-full w-full">
    <!-- Main Content (Items + Categories) -->
    <div class="w-full md:w-6/8">
        <!-- Categories and Items -->
        <div class="flex flex-col">
            <!-- Categories -->
            <div
                class="category-scrollbar flex mb-4 pb-2"
                on:wheel={handleWheel}
            >
                <button
                    class:selected={selectedCategory === 'All'}
                    on:click={() => filterItems('All')}
                    disabled={selectedCategory === 'All'}
                >
                    <span>All</span>
                </button>
                {#each Object.values(shopData.shopCategory) as category}
                    <button
                        style="min-width: {category?.name?.length *
                            10}px; color: {selectedCategory === category.name
                            ? 'black'
                            : 'gray'}"
                        class:selected={selectedCategory === category.name}
                        on:click={() => filterItems(category.name)}
                        disabled={selectedCategory === category.name}
                    >
                        <span>{category.name}</span>
                    </button>
                {/each}
            </div>

            <!-- Items -->
            <div class="item-scrollbar">
                <div class="grid grid-cols-3 gap-2">
                    {#each visuallyShuffledItems as item (item?.name)}
                        <div
                            animate:flip={{ duration: 500, easing: cubicOut }}
                            class="item-card"
                        >
                            <div
                                class="item-details flex flex-col justify-between"
                            >
                                <div class="text-white">
                                    <h3 class="text-base font-semibold">
                                        {item.name}
                                    </h3>
                                    <p class=" text-sm text-[#ffffff8c]">
                                        {shopData.shopCategory[item.page].name}
                                    </p>
                                    {#if item.stock > 0}
                                        <p class="text-sm text-[#ffffff8c]">
                                            Stock: {item.stock}
                                        </p>
                                    {:else}
                                        <p class="text-red-500 text-sm">
                                            Out of stock
                                        </p>
                                    {/if}
                                </div>
                                <button
                                    class="mt-2 px-[15px] py-[2px] bg-slate-700 hover:bg-slate-800 text-white text-sm rounded self-start"
                                    on:click={() => addToCart(item)}
                                    disabled={item.stock === 0}
                                >
                                    ${item.price}
                                </button>
                            </div>
                            <img
                                src={item.image}
                                alt={item.name}
                                class="item-image"
                            />
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Cart Section -->
    <div class="w-full md:w-2/6 mt-4 md:mt-0 md:pl-4">
        <div class="flex flex-col items-center">
            <!-- src={shopData?.shopLogo} -->
            <img
                src={shopData?.shopLogo}
                alt="images not found"
                class="w-28 h-28 mb-1"
            />
            <h3
                class="text-center text-slate-100 text-xl font-bold overflow-hidden whitespace-nowrap text-ellipsis max-w-[130px]"
            >
                {shopData.shopName}
            </h3>
            <p class="text-center mt-1 text-sm">
                {shopData.shopDescription.length > 65
                    ? shopData.shopDescription.slice(0, 65) + '...'
                    : shopData.shopDescription}
            </p>
        </div>
        <!-- Cart -->
        <div class="mt-2">
            <h4 class="text-base text-center text-slate-100 font-semibold mb-2">
                Shopping Cart
            </h4>
            <div class="cart p-1 rounded">
                {#if cart.length === 0}
                    <p class="text-red-600 text-sm text-center font-semibold">
                        Cart is empty
                    </p>
                {:else}
                    <ul>
                        {#each cart as item}
                            <li class="cart-item text-sm">
                                <div>
                                    {item.name.length > 21
                                        ? item.name.slice(0, 21) + '...'
                                        : item.name}
                                </div>
                                <button
                                    class="px-2 font-bold text-slate-100 bg-[#f8717166] rounded mr-2"
                                    on:click={() => decrementQuantity(item)}
                                    >-</button
                                >

                                <span>
                                    {item.name.length > 15
                                        ? item.name.slice(0, 15) + '...'
                                        : item.name}
                                    {item.quantity > 1
                                        ? `${item.quantity}x `
                                        : ''}
                                </span>
                                <button
                                    class="px-2 bg-slate-700 rounded ml-2"
                                    on:click={() => incrementQuantity(item)}
                                    >+</button
                                >
                                <div>
                                    {item.quantity > 1
                                        ? `${item.quantity}x - `
                                        : ''}${item.price * item.quantity}
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
            <!-- Total Price -->
            <div class="flex justify-between mt-4">
                <span class="text-lg text-slate-100 font-semibold">Total</span>
                <span class="text-lg text-[#2ff36d] font-semibold"
                    >${totalPrice()}</span
                >
            </div>
            <!-- Pay and Clear Buttons -->
            <div class="flex justify-between mt-4">
                <button
                    class="flex-1 px-4 py-1 text-lg bg-slate-700 hover:bg-slate-800 text-white rounded mr-2"
                    on:click={openModal}
                    disabled={cart.length === 0}>PAY</button
                >
                <button
                    class="flex-1 px-4 py-1 text-lg bg-[#ffffff14] hover:bg-[#ffffff26] text-white rounded ml-2"
                    on:click={clearCart}>CLEAR</button
                >
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
{#if isModalVisible}
    <div class="modal-overlay">
        <div class="modal">
            <h1 class="text-xl font-bold mb-4">Confirm Payment</h1>
            <p class="mb-4">Total Amount: ${totalPrice()}</p>
            <div class="flex justify-between">
                <button
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded"
                    on:click={payWithCard}>Pay with Card</button
                >
                <button
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded"
                    on:click={payWithCash}>Pay with Cash</button
                >
            </div>
            <button
                class="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                on:click={closeModal}>Cancel</button
            >
        </div>
    </div>
{/if}

<style>
    .selected {
        background: linear-gradient(
            0deg,
            rgba(116, 185, 110, 0.15) 0%,
            rgba(116, 185, 110, 0.018) 45.05%,
            rgba(116, 185, 110, 0) 74.14%
        ) !important;
        border-bottom: 1.5px solid rgba(116, 185, 110, 0.65) !important;
        filter: drop-shadow(0px 0px 73px rgba(116, 185, 110, 0.05)) !important;
        border-radius: 25px !important;
    }
    .selected > span {
        background: rgba(116, 185, 110, 0.65) !important;
    }
    .cart {
        height: 130px; /* Set a fixed height */
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
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: rgba(255, 255, 255, 0.05);
        padding: 7px;
        border-radius: 4px;
        margin-bottom: 5px;
        transition: transform 0.3s ease;
        overflow: hidden;
    }
    .cart-item div:first-child {
        transition: transform 0.3s ease;
        position: absolute;
        left: 5px;
    }
    .cart-item div:last-child {
        transition: transform 0.3s ease;
        position: absolute;
        right: 5px;
    }
    .cart-item:hover div:last-child,
    .cart-item:hover div:first-child {
        bottom: -30px;
    }
    .cart-item button,
    .cart-item span {
        transform: translateY(30px);
        transition: transform 0.3s ease;
    }
    .cart-item button,
    .cart-item span {
        transform: translateY(30px);
        transition: transform 0.3s ease;
    }
    .cart-item:hover button {
        transform: translateY(0px);
    }
    .cart-item:hover span {
        transform: translateY(0px);
    }
    .category-scrollbar {
        overflow-x: auto;
        white-space: nowrap;
        width: 455px;
        scroll-behavior: smooth; /* Enable smooth scrolling */
    }
    .category-scrollbar::-webkit-scrollbar {
        height: 1px; /* Set the height of the scrollbar */
    }
    .category-scrollbar::-webkit-scrollbar-thumb {
        background-color: #91a8ee; /* Set the color of the scrollbar thumb */
        border-radius: 4px; /* Set the border radius of the scrollbar thumb */
    }
    .item-scrollbar {
        overflow-y: auto;
        height: 300px;
    }
    .item-scrollbar::-webkit-scrollbar {
        width: 1px; /* Set the width of the scrollbar */
    }
    .item-scrollbar::-webkit-scrollbar-thumb {
        background-color: #91a8ee; /* Set the color of the scrollbar thumb */
        border-radius: 4px; /* Set the border radius of the scrollbar thumb */
    }
    .item-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border-radius: 8px;
        transition: transform 0.3s ease;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 80.34%
        );
        backdrop-filter: blur(4px);
    }

    .item-details > div > h3 {
        height: 25px;
        line-height: 12px;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .item-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .item-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }
    .category-scrollbar > button {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 5px;
        color: rgba(255, 255, 255, 0.9) !important;
        display: flex;
        justify-content: center;
        text-transform: uppercase;
        font-size: 9px;
        padding: 4px 15px 7px;
        font-weight: 600;
        border-bottom: 1.5px solid rgba(116, 185, 110, 0);
        min-width: 45px;
        margin: 0% 0.5%;
        overflow: hidden;
        transition: 0.25s ease-in-out;
        -webkit-transition: 0.25s ease-in-out;
    }
    .category-scrollbar > button > span {
        display: flex;
        justify-content: center;
        max-width: 30px;
        height: 1px;
        background: transparent;
        margin: 0px auto 8px;
        transition: 0.25s ease-in-out;
        -webkit-transition: 0.25s ease-in-out;
    }
    .category-scrollbar > button:hover {
        background: linear-gradient(
            0deg,
            rgba(116, 185, 110, 0.15) 0%,
            rgba(116, 185, 110, 0.018) 45.05%,
            rgba(116, 185, 110, 0) 74.14%
        );
        border-bottom: 1.5px solid rgba(116, 185, 110, 0.65);
        filter: drop-shadow(0px 0px 73px rgba(116, 185, 110, 0.05));
        border-radius: 25px;
    }
    .category-scrollbar > button:hover > span {
        background: rgba(116, 185, 110, 0.65);
    }
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: inherit;
    }
    .modal {
        background: #2d3748;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 300px;
        text-align: center;
    }
</style>
