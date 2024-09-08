<template>
    <div class="max-w-[600px] shadow-lg rounded-lg bg-[#fff]">
      <!-- Header -->
      <div class="bg-[#FF6F61] text-[#ffffff] flex justify-between py-3 px-5 rounded-t-lg">
        <h1>Protokoll</h1>
        <!-- Hier wollte ich eigentlich noch eine Filter Funktion hinzufügen, war mir jetzt aber nicht sicher ob dies gewünscht war -->
        <MagnifyingGlassSolid />
      </div>

      <!-- Filter Button -->
      <div class="flex justify-center items-center my-4 text-[#ffffff]">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="{
            'py-1 px-2 cursor-pointer': true,
            'rounded-l-lg': tab.key === 'all',
            'rounded-r-lg': tab.key === 'log',
            'bg-[#FF6F61] opacity-100': activeTab === tab.key,
            'bg-[#FF6F61] opacity-50': activeTab !== tab.key,
            'bg-[#FF6F61] opacity-50 hover:opacity-100': activeTab !== tab.key
          }"
          @click="setActiveTab(tab.key)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- Log Liste -->
      <div>
        <!-- Wenn Daten vorhanden sind wird die Log Liste ausgegeben -->
        <div v-if="data" class="log-view-container">
          <div v-for="item in data" :key="item.id" class="log-view-item-container">
            <div class="log-icon">
                <component :is="getIconComponent(item.typ)" />
            </div> 
            <div class="log-discription">
                <div class="log-msg">{{ getShortMessage(item.message) }}</div>
                <div class="log-timestemp">{{ formatTimeDifference(item.stamp) }} von {{ item.username }}</div>
            </div>
          </div>
        </div>
        
        <!-- Loading Spinner solange keine Daten vorhanden sind -->
        <LoadingSpinner v-else />
      </div>

      <!-- Pagination / Ich hätte es noch Dynamisch gemacht, aber im Mockup sind nur 4 -->
      <div class="flex justify-end items-center my-4 text-[#ffffff] pb-2 pr-5">
          <div
            v-for="page in filteredPages"
            :key="page.number"
            class="py-1 px-3 cursor-pointer"
            :class="{
              'rounded-lg': count <= 10,
              'rounded-l-lg': page.number === 1 && count > 10,
              'rounded-r-lg': (page.number === filteredPages.length && count <= (page.number + 10)) || page.number === 4,
              'bg-[#FF6F61] opacity-100': activePagination === page.number,
              'bg-[#FF6F61] opacity-50': activePagination !== page.number,
              'bg-[#FF6F61] opacity-50 hover:opacity-100': activePagination !== page.number,
            }"
            @click="setActivePagination(page.number)"
          >
            {{ page.number }}
          </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
    // Node und Vue Packete
    import { ref, computed, onMounted } from 'vue'
    import { formatDistanceToNowStrict } from 'date-fns'
    import { de } from 'date-fns/locale'

    // import utils
    import { getData } from '../utils/globalFunction'

    // import components
    import TriangleExclamationSolid from './icons/TriangleExclamationSolid.vue'
    import CircleXmarkSolid from './icons/CircleXmarkSolid.vue'
    import CircleInfoSolid from './icons/CircleInfoSolid.vue'
    import MagnifyingGlassSolid from './icons/MagnifyingGlassSolid.vue'
    import LoadingSpinner from './LoadingSpinner.vue';

    // Interface für Log Einträge
    interface LogEntry {
        id: number;
        typ: string;
        message: string;
        stamp: string;
        username: string;
    }

    // States
    // States für die Filter Buttons
    const tabs = [
      { key: 'all', label: 'Alle' },
      { key: 'error', label: 'Fehler' },
      { key: 'warning', label: 'Warnung' },
      { key: 'log', label: 'Log' }
    ];

    // States für Pagination
    const filteredPages = computed(() => {
      return [
        { number: 1, minCount: 0 },
        { number: 2, minCount: 10 },
        { number: 3, minCount: 20 },
        { number: 4, minCount: 30 }
      ].filter(page => count.value > page.minCount);
    });

    // Variablen
    const activePagination = ref(1)
    const activeTab = ref('all')
    const count = ref(0)
    const data = ref<LogEntry[] | null>(null)

    // fetchData wird ausgeführt, wenn die Komponente montiert ist
    onMounted(async () => {
      //Lädt die Daten von der API und aktualisiert die lokalen Daten- und Zählvariablen.
      const response = await getData({});
      
      if (response) {
        data.value = response.items
        count.value = response.count
      }
    })

    /**
     * Setzt den aktiven Tab und lädt die entsprechenden Daten von der API.
     *
     * Diese Funktion aktualisiert den `activeTab`-Wert mit dem ausgewählten Tab
     * und ruft dann die API auf, um die relevanten Daten basierend auf dem
     * aktuellen Tab abzurufen. Die Daten werden dann in der Variablen
     * `data` und `count` gespeichert, und die Paginierung wird auf die erste Seite
     * zurückgesetzt.
     *
     * @param tab - Der Pfad oder die Bezeichnung des aktuellen Tabs, der ausgewählt wurde.
     */
    const setActiveTab = async (tab: string) => {
      activeTab.value = tab

      const response = await getData({tab: tab});

      if (response) {
        data.value = response.items
        count.value = response.count
        activePagination.value = 1
      }
    }

    /**
     * Setzt die aktuelle Seite für die Pagination und lädt die Daten für diese Seite.
     * 
     * @param page - Die Seite, die als aktiv gesetzt werden soll.
     */
    const setActivePagination = async (page: number) => {
      activePagination.value = page

      const response = await getData({tab: activeTab.value, page: page});

      if (response) {
        data.value = response.items
      }
    }

    // Funktion zum Abrufen des Icons basierend auf dem Typ
    const getIconComponent = (type: string) => {
      switch (type) {
        case 'log':
          return CircleXmarkSolid
        case 'error':
          return TriangleExclamationSolid
        case 'warning':
          return CircleInfoSolid
        default:
          return null
      }
    }

    // Funktion zum Kürzen der Nachricht
    const getShortMessage = (message: string) => {
      const index = message.indexOf(' vom ')
      return index !== -1 ? message.slice(0, index) : message
    }

    // Funktion zur Berechnung der Zeitdifferenz
    const formatTimeDifference = (timestamp: any) => {
      return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true, locale: de })
    }
</script>
  
<style scoped>
  .log-view-item-container {
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid #ccc;
    padding: 10px 20px;
  }

  /* Entferne das border-bottom für den letzten Eintrag */
  .log-view-item-container:last-child {
    border-bottom: none;
  }

  .log-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .log-discription .log-msg{
    font-size: 0.9em;
  }

  .log-discription .log-timestemp{
    font-size: 0.7em;
    color: #888888;
  }
</style>  