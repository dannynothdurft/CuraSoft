<template>
  <header class="bg-[#FF6F61] text-[#ffffff] flex items-center px-4 gap-10 h-11">
    <RouterLink to="/" class="title">GO.VITAL</RouterLink>

    <nav class="ml-10 flex items-center gap-5 h-full">
      <RouterLink
        v-for="(item, index) in navItems"
        :key="index"
        :to="item.path"
        :class="{
          'border-b-[3px] border-white px-4 h-full flex justify-center items-center': isActive(
            item.path
          ),
          'text-white px-4 hover:border-b-[3px] hover:border-white h-full flex justify-center items-center':
            !isActive(item.path)
        }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = ref([
  { path: '/', label: 'Start' },
  { path: '/patients', label: 'Patienten' },
  { path: '/curves', label: 'Kurven' },
  { path: '/settings', label: 'Einstellungen' },
  { path: '/log', label: 'Protokoll' }
])

function isActive(path: string) {
  return route.path === path
}
</script>
