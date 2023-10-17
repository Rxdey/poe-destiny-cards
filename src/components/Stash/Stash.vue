<template>
  <div class="stash" v-if="value">
    <div class="stash__header">仓库</div>
    <div class="stash__wrap">
      <div class="stash__content">
        <div class="stash__content--grid" v-for="(item, i) in displayCards" :key="i">
          <!-- <DivinationCard :type="item.type" :disabled="!item.detail" :stack="item.detail?.number" /> -->
        </div>
      </div>
    </div>
    <div class="stash__filter">

      <div>
        <el-button @click="openCard" size="small">开卡！</el-button>
        <el-button @click="clearCard" size="small">清空</el-button>
        <el-button @click="openAllCard" size="small">发牌</el-button>
      </div>
      <div class="search">
        <el-row>
          <el-col :span="11">
            <el-input v-model="filtersText" placeholder="过滤..." size="small" />
          </el-col>
          <el-col :span="12" :offset="1">
            <el-select v-model="filterStatus" size="small">
              <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DivinationCard from '@/components/DivinationCard/DivinationCard.vue';
import usePlayerStore from '@/store/modules/usePlayerStore';
import { useValue } from '@/hooks/useValue';

const filterOptions = [
  { label: '全部', value: 1 },
  { label: '已持有', value: 2 },
  { label: '已成套', value: 3 },
  { label: '尚未取得', value: 4 },
];
const playerStore = usePlayerStore();
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const filterStatus = ref(2);
const filtersText = ref('');
const value = useValue(props, emit);

const displayCards = computed(() => {
  // 查询用户仓库位置的卡片
  // const currentCards = playerStore.player.item.filter(item => item.position.type === 'stash' && item.class === 'DivinationCards');
  // return playerStore.CARD_POOL.map(item => {
  //   const card = currentCards.find(c => c.id === item.id);
  //   const obj: CardData & { detail?: ItemType } = item;
  //   if (!!card) {
  //     obj['detail'] = card;
  //   } else {
  //     obj['detail'] = undefined;
  //   }
  //   return obj;
  // }).filter(item => {
  //   if (filterStatus.value === 2) return !!item.detail && `${item.name} ${JSON.stringify(item.explicitMod)}`.search(filtersText.value) >= 0;
  //   if (filterStatus.value === 3) return item.detail && item.detail?.number >= parseInt(item?.stack) && `${item.name} ${JSON.stringify(item.explicitMod)}`.search(filtersText.value) >= 0
  //   return item && `${item.name} ${JSON.stringify(item.explicitMod)}`.search(filtersText.value) >= 0;
  // });
  return []
});


const openCard = () => {
  // playerStore.ADD_CARD(1);
};
const openAllCard = () => {
  // playerStore.ADD_CARD(-1);
};
const clearCard = () => {
  // playerStore.CLEAR_CARD();
};

</script>

<style lang="less" scoped>
.stash {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  height: 650px;
  background-color: rgba(0, 0, 0, .8);
  padding: 10px;
  display: flex;
  flex-flow: column;

  &__header {
    text-align: center;
    font-size: 20px;
    color: #efdebd;
    padding: 12px 0;
  }

  &__wrap {
    width: 100%;
    flex: 1;
    min-height: 1px;
    overflow: hidden;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 10px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 10px 10px 10px 0;

    &--grid {
      display: flex;
      flex-flow: row;
      justify-content: center;
    }
  }

  &__filter {
    margin-top: 8px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;

    .search {
      width: 60%;
    }
  }
}
</style>
