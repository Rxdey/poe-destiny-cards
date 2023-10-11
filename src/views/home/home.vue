<template>
  <div class="home">
    <div class="stage">
      <!-- <div :class="['img-button', btn.key]" v-for="btn in GAME_BUTTONS" :key="btn.key">
        <img :src="`/img/${btn.key}.webp`">
      </div> -->
    </div>
    <div class="menu">
      <!-- <Stash v-model="showStash" /> -->
      <Workbench v-model="showWorkbench" />
      <Pack />
    </div>
    <Teleport to="body" v-if="mouseItem">
      <MiniItemIcon :data="mouseItem" :position="GRID_TYPE.MOUSE" :currentXY="currentXY" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import Workbench from '@/components/Workbench/Workbench.vue';
import Pack from '@/components/Pack/Pack.vue';
import MiniItemIcon from '@/components/MiniItemIcon/MiniItemIcon.vue';
import userPlayerStore from '@/store/modules/userPlayerStore';
import { GenerateCard } from '@/factory';
import { GRID_TYPE } from '@/data/const.data';

const playerStore = userPlayerStore();

const GAME_BUTTONS = [
  { name: '花园工艺台', key: 'HarvestWorkbench' },
  { name: '仓库', key: 'Stash' },
  { name: '丽莉·罗斯', key: 'Lilly' },
  { name: '传送', key: 'Waypoint' },
];

const showWorkbench = ref(true);
const currentXY = ref({
  clientX: 0,
  clientY: 0
});

const mouseItem = computed(() => playerStore.MOUSE_ITEM);

onMounted(() => {
  // document.addEventListener('keydown', (e: KeyboardEvent) => {
  //   if (e.key === 'i') {

  //   }
  // })
  (window as any).GenerateCard = GenerateCard;
});

watch(() => mouseItem.value, (val) => {
  document.body.onmousemove = val ? null : (e: MouseEvent) => {
    currentXY.value = {
      clientX: e.clientX,
      clientY: e.clientY
    }
  };
}, {
  immediate: true
})
</script>

<style lang="less">
@import url('./index.less');
</style>