<template>
  <div class="divination-card">
    <div class="divination-card--background" v-if="!props.disabled">
      <img v-if="!!current" :src="`./img/card/${current.icon}`" :key="current.icon" />
    </div>
    <div class="divination-card__exmod" :class="{ disabled }" v-if="!!current">
      <!-- 名字 -->
      <div class="divination-card--name">{{ current.name }}</div>
      <template v-if="!props.disabled">
        <!-- 堆叠 -->
        <div class="divination-card--stack" :class="{ single: quantity >= current.stack }">
          <span v-if="current.stack === 1 && quantity === 1">{{ quantity }}</span>
          <span v-else>{{ quantity }}/{{ current.stack }}</span>
        </div>
        <div class="divination-card--wrap">
          <!-- 奖励 -->
          <div class="divination-card--reward">
            <div>
              <template v-for="(item, index) in current.explicitMod">
                <span class="explicit-mod" :style="{ '--mod-color': `var(--color-${item.type})` }">{{ item.value }}</span>
                <br v-if="item.type != 'default'" />
              </template>
            </div>
          </div>
          <div class="divination-card--line"></div>
          <!-- 描述 -->
          <div class="divination-card--flavour">
            {{ current.flavourText }}
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
// import { useRouter, useRoute } from 'vue-router';
// import usePlayerStore from '@/store/modules/usePlayerStore';;
import { CARD_POOL } from '@/data/card.data';
import { CardData } from '@/types/data';

type Props = {
  type?: string;
  name?: string;
  quantity?: number;
  disabled?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  type: '',
  name: '',
  quantity: 1,
  disabled: false
})
// const playerStore = usePlayerStore();
const current = computed<CardData | null>(() => {
  if (props.type) return CARD_POOL.find((item: CardData) => item.type === props.type) || null;
  if (!props.type && props.name) return CARD_POOL.find((item: CardData) => item.name === props.name) || null;
  return null;
});

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
