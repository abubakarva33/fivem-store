<script lang="ts">
    import { CONFIG, IS_BROWSER } from './stores/stores';
    import { InitialiseListen } from '@utils/listeners';
    import Visibility from '@providers/Visibility.svelte';
    import ImageHolder from '@components/ImageHolder.svelte';
    import TabletShop from '@components/TabletShop.svelte';

    CONFIG.set({
        fallbackResourceName: 'debug',
        allowEscapeKey: true,
    });

    InitialiseListen();
</script>

<Visibility>
    <!-- <ImageHolder /> -->
    <TabletShop />
</Visibility>

{#if import.meta.env.DEV}
    {#if $IS_BROWSER}
        {#await import('./providers/Debug.svelte') then { default: Debug }}
            <Debug />
        {/await}
    {/if}
{/if}
