<template>
  <div class="home">
    <el-alert title="仅供娱乐，与游戏内概率不同，无参考价值" type="info" effect="dark" />
    <div class="stage">
      <div :class="['img-button', btn.key]" v-for="btn in GAME_BUTTONS" :key="btn.key">
        <img :src="`/img/${btn.key}.webp`">
      </div>
    </div>
    <div class="menu">
      <!-- <Stash v-model="showStash" /> -->
      <Workbench v-model="showWorkbench" />
      <Pack @log="showLog = true" @setting="showSetting = true" />
    </div>
    <Teleport to="body" v-if="mouseItem">
      <MiniItemIcon :data="mouseItem" :position="GRID_TYPE.MOUSE" :currentXY="globalXY" />
    </Teleport>
    <Log v-model="showLog" />
    <div class="log-fixed">
      <LogDetail />
    </div>

    <!-- 先随便搞个 -->
    <el-dialog v-model="showSetting" title="概率调整" width="600px">
      <div class="setting-content">
        <div class="setting-slider">
          <div class="slider-label">结果均值趋势(默认0,结果只是趋近非一定): {{ form.trend }}%</div>
          <div class="slider-desc">
            <span>趋近减半</span>
            <span>趋近不变</span>
            <span>趋近翻倍</span>
          </div>
          <el-slider v-model="form.trend" :min="-100" :max="100" :format-tooltip="val => `${val}%`" :marks="{ 0: '0' }" />
        </div>
        <div class="setting-slider">
          <div class="slider-label">标准差系数调整(默认0.75)</div>
          <el-input-number v-model="form.ratio" :precision="2" :step="0.1" :max="10" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="default" @click="showSetting = false">取消</el-button>
          <el-button type="info" @click="onSubmit">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
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
const showSetting = ref(false);
const showWorkbench = ref(true);
const globalXY = computed(() => playerStore.globalXY);
const form = ref({
  trend: 0,
  ratio: 0.75
});

const mouseItem = computed(() => playerStore.MOUSE_ITEM);

const onSubmit = () => {
  playerStore.UPDATE_SETTING(form.value);
  showSetting.value = false;
  ElMessage.info('已修改');
};
onMounted(() => {
  form.value.trend = playerStore.setting.trend;
  form.value.ratio = playerStore.setting.ratio;
});
</script>

<style lang="less">
@import url('./index.less');
</style>