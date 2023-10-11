<template>
    <div class="workbench" v-if="value">
        <div class="workbench__content">
            <div class="workbench__header">花园工艺台</div>
            <div class="workbench__wrap">
                <div class="work-card" :class="{ active: active === work.key }" v-for="work in list" :key="work.key" @click="onSelect(work)">
                    <p v-html="work.label"></p>
                    <div class="work-cost">
                        <span>{{ work.cost }}</span>
                        <div class="work-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="workbench__card">
            <div class="card-grid" @click="onGridClick">
                <template v-if="customCard">
                    <MiniItemIcon :data="customCard" :position="GRID_TYPE.WORK" @grid-click="onGridClick" />
                </template>
            </div>
            <!-- <div class="card-button" :class="{ disabled: !customCard }" @click="onUse">工艺(非绑定)</div> -->
            <div class="card-button">
                <el-button size="small" type="info" :disabled="!customCard" @click="onUse">工艺(非绑定)</el-button>
            </div>
        </div>
        <div class="workbench__costNum">
            <div class="cotton" v-for="cotton in cottonList" :key="cotton.label">
                <div class="cotton-icon">
                    <img :src="`/img/${cotton.label}.png`">
                </div>
                <div class="cotton-num">{{ formatNum(cotton.num) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import random from 'random';
import { useValue } from '@/hooks/useValue';
import { list, cottonList } from './options';
import userPlayerStore from '@/store/modules/userPlayerStore';
import MiniItemIcon from '@/components/MiniItemIcon/MiniItemIcon.vue';
import { eventBus } from '@/store/bus';
import { formatNum } from '@/utils';
import { GRID_TYPE } from '@/data/const.data';


const playerStore = userPlayerStore();
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const active = ref(1);
const value = useValue(props, emit);

const customCard = computed(() => playerStore.WORK_ITEM);

const onSelect = ({ key = 0 }) => {
    active.value = key;
}
/** 鼠标单张放置 */
const splitSingleItems = () => {
    if (!playerStore.MOUSE_ITEM) return;
    playerStore.SPLIT_SINGLE_ITEMS({
        gridId: 'work',
        id: playerStore.MOUSE_ITEM.id,
        position: GRID_TYPE.WORK
    });
};
const onGridClick = (event: MouseEvent) => {
    if (!playerStore.MOUSE_ITEM) return;
    // 检查 Shift 键是否按下
    if (event.shiftKey) {
        splitSingleItems();
        return;
    }
    playerStore.UPDATE_ITEM_POSITION({
        gridId: 'work',
        id: playerStore.MOUSE_ITEM.id,
        position: GRID_TYPE.WORK,
    });
};
/**
 * 使用工作台
 */
const onUse = () => {
    if (active.value === 0) {
        ElMessage.error('这个玩意儿还没做');
        return;
    }
    gamblingCard();
};

/** 开始赌卡！ */
const gamblingCard = () => {
    if (!customCard.value) return;
    if (customCard.value.quantity > Math.floor(customCard.value.item.stack / 2)) {
        ElMessage.error('卡片不能超过最大堆叠数量的一半!');
        return;
    }
    const range = (customCard.value.quantity * 2);
    const randomNum = random.int(0, range);
    // 结果
    const res = randomNum - customCard.value.quantity;
    playerStore.SET_RECORD(customCard.value.itemId, res, 1);
    playerStore.SET_ITEMS_NUM(customCard.value.id, customCard.value.quantity + res);
}
</script>

<style lang="less">
@import url('./index.less');
</style>
