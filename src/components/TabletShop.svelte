<script lang="ts">
    import ShopComponent from './ShopComponent.svelte';
</script>

<!-- Fullscreen Container -->
<div class="h-screen w-screen flex items-center justify-center bg-transparent">
    <!-- Tablet Frame -->
    <div
        class="tablet-screen w-[640px] h-[360px] rounded-[1.5rem] shadow-lg border-8 border-gray-800 relative"
    >
        <!-- Camera Hole -->
        <div
            class="camera-hole absolute top-2 right-2 bg-black w-4 h-4 rounded-full"
        ></div>
        <!-- Tablet Screen -->
        <div
            class=" w-full h-full rounded-[0.8rem] overflow-hidden p-2 flex flex-col items-center justify-center"
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
        background-image: url('/images/tabletBg.png');
        background-size: cover;
        background-position: bottom center;
        background-repeat: no-repeat;
    }

    @media (min-width: 3840px) {
        .tablet-screen {
            zoom: 350%;
        }
    }

    @media (min-width: 2560px) and (max-width: 3839px) {
        .tablet-screen {
            zoom: 300%;
        }
    }

    @media (min-width: 1920px) and (max-width: 2559px) {
        .tablet-screen {
            zoom: 250%;
        }
    }

    @media (min-width: 1600px) and (max-width: 1919px) {
        .tablet-screen {
            zoom: 200%;
        }
    }

    @media (min-width: 1366px) and (max-width: 1599px) {
        .tablet-screen {
            zoom: 175%;
        }
    }

    @media (min-width: 1280px) and (max-width: 1365px) {
        .tablet-screen {
            zoom: 160%;
        }
    }

    @media (min-width: 1024px) and (max-width: 1279px) {
        .tablet-screen {
            zoom: 150%;
        }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
        .tablet-screen {
            zoom: 125%;
        }
    }

    @media (min-width: 576px) and (max-width: 767px) {
        .tablet-screen {
            zoom: 100%;
        }
    }

    @media (max-width: 575px) {
        .tablet-screen {
            zoom: 75%;
        }
    }
</style>
