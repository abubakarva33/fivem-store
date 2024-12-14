<script lang="ts">
    import { Receive, Send } from '@enums/events';
    import { VISIBLE, CONFIG, SHOPDATA } from '@stores/stores';
    import { ReceiveEvent, SendEvent } from '@utils/eventsHandlers';
    import { onMount } from 'svelte';

    ReceiveEvent(Receive.visible, (data: any) => {
        if (data) {
            VISIBLE.set(true);
            SHOPDATA.set(data);
        } else {
            VISIBLE.set(false);
        }
    });

    ReceiveEvent(Receive.updateShopData, (data: any) => {
        SHOPDATA.set(data);
    });

    ReceiveEvent(Receive.close, () => {
        VISIBLE.set(false);
    });

    onMount(() => {
        if (!$CONFIG.allowEscapeKey) return;

        const keyHandler = (e: KeyboardEvent) => {
            if ($VISIBLE && ['Escape'].includes(e.code)) {
                SendEvent(Send.close);
            }
        };
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    });
</script>

{#if $VISIBLE}
    <main>
        <slot />
    </main>
{/if}

<style>
    main {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        user-select: none;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        height: 100vh;
        width: 100vw;
    }
</style>
