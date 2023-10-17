<template>
  <div class="home">
    <div class="stage">
      <div :class="['img-button', btn.key]" v-for="btn in GAME_BUTTONS" :key="btn.key">
        <img :src="`/img/${btn.key}.webp`">
      </div>
    </div>
    <div class="menu">
      <!-- <Stash v-model="showStash" /> -->
      <Workbench v-model="showWorkbench" />
      <Pack @log="showLog = true"/>
    </div>
    <Teleport to="body" v-if="mouseItem">
      <MiniItemIcon :data="mouseItem" :position="GRID_TYPE.MOUSE" :currentXY="globalXY"/>
    </Teleport>
    <Log v-model="showLog"/>
    <div class="log-fixed">
      <LogDetail />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Workbench from '@/components/Workbench/Workbench.vue';
import Pack from '@/components/Pack/Pack.vue';
import Log from '@/components/Log/Log.vue';
import LogDetail from '@/components/Log/LogDetail.vue';
import MiniItemIcon from '@/components/MiniItemIcon/MiniItemIcon.vue';
import usePlayerStore from '@/store/modules/usePlayerStore';
import { GenerateCard } from '@/factory';
import { GRID_TYPE } from '@/data/const.data';

const playerStore = usePlayerStore();

const GAME_BUTTONS = [
  { name: '花园工艺台', key: 'HarvestWorkbench' },
  { name: '仓库', key: 'Stash' },
  { name: '丽莉·罗斯', key: 'Lilly' },
  { name: '传送', key: 'Waypoint' },
];

const showLog = ref(false);
const showWorkbench = ref(true);
const globalXY = computed(() => playerStore.globalXY);

const mouseItem = computed(() => playerStore.MOUSE_ITEM);

onMounted(() => {
  // document.addEventListener('keydown', (e: KeyboardEvent) => {
  //   if (e.key === 'i') {

  //   }
  // })
});
</script>

<style lang="less">
@import url('./index.less');
</style>