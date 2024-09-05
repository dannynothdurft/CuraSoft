<template>
    <footer class="flex justify-end gap-10 mx-10 py-3">
        <RouterLink to="/privacy" :class="{'text-[#888888]': !isActive('/privacy')}">Datenschutz</RouterLink>
        <RouterLink to="/legal" :class="{'text-[#888888]': !isActive('/legal')}">Impressum</RouterLink>
    </footer>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';

    const route = useRoute();

    function isActive(path: string) {
        return route.path === path;
    }
</script>