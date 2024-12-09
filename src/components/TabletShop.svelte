<script lang="ts">
    import ShopComponent from './ShopComponent.svelte';
</script>

<!-- Fullscreen Container -->
<div class="h-screen w-screen flex items-center justify-center bg-transparent">
    <!-- Tablet Frame -->
    <div
        class="tablet-screen bg-gray-900 w-[640px] h-[360px] rounded-[1.5rem] shadow-lg border-8 border-gray-800 relative"
    >
        <!-- Camera Hole -->
        <div
            class="camera-hole absolute top-2 right-2 bg-black w-4 h-4 rounded-full"
        ></div>
        <!-- Tablet Screen -->
        <div
            class="bg-gray-100 w-full h-full rounded-[0.8rem] overflow-hidden p-2 flex flex-col items-center justify-center"
        >
            <!-- Tablet Content -->
            <ShopComponent />
        </div>
        <!-- Tablet Button at Bottom -->
        <div
            class="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 bg-gray-800 w-16 h-1.5 rounded-full"
        ></div>
    </div>
</div>

<style>
    .tablet-screen {
        transform: scale(1);
        transition: transform 0.3s ease-in-out;
    }

    @media (min-width: 3840px) {
        .tablet-screen {
            transform: scale(3.5);
        }
    }

    @media (min-width: 2560px) and (max-width: 3839px) {
        .tablet-screen {
            transform: scale(3);
        }
    }

    @media (min-width: 1920px) and (max-width: 2559px) {
        .tablet-screen {
            transform: scale(2.5);
        }
    }

    @media (min-width: 1600px) and (max-width: 1919px) {
        .tablet-screen {
            transform: scale(2);
        }
    }

    @media (min-width: 1366px) and (max-width: 1599px) {
        .tablet-screen {
            transform: scale(1.75);
        }
    }

    @media (min-width: 1280px) and (max-width: 1365px) {
        .tablet-screen {
            transform: scale(1.6);
        }
    }

    @media (min-width: 1024px) and (max-width: 1279px) {
        .tablet-screen {
            transform: scale(1.5);
        }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
        .tablet-screen {
            transform: scale(1.25);
        }
    }

    @media (min-width: 576px) and (max-width: 767px) {
        .tablet-screen {
            transform: scale(1);
        }
    }

    @media (max-width: 575px) {
        .tablet-screen {
            transform: scale(0.75);
        }
    }
</style>
