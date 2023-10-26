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
            <div class="card-grid" @click="onGridClick($event, workGrid)" @dragenter="dragenter" @drop="drop($event, workGrid)" @dragleave="dragleave">

                <div v-if="customCard">
                    <MiniItemIcon :data="customCard" :position="GRID_TYPE.WORK" @grid-click="onGridClick($event, workGrid)" />
                </div>

            </div>
            <div class="card-button">
                <el-button size="small" type="info" :disabled="!customCard" @click="onUse">工艺(非绑定)</el-button>
            </div>
            <div class="card-button">
                <!-- <el-button size="small" type="info" @click="autoWork">全自动(测试)</el-button> -->
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
import usePlayerStore from '@/store/modules/usePlayerStore';
import useLogStore from '@/store/modules/useLogStore';
import MiniItemIcon from '@/components/MiniItemIcon/MiniItemIcon.vue';
import { Grids } from '@/store/types';
import { formatNum } from '@/utils';
import { GRID_TYPE } from '@/data/const.data';
import { HIGH_VALUE_LIST } from '@/data/card.data';
import { useGrids } from '@/hooks/useGrids';

const workGrid: Grids = {
    id: 'work',
    type: GRID_TYPE.WORK
};
const playerStore = usePlayerStore();
const logStore = useLogStore();
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

const { dragenter, dragleave, drop, onGridClick } = useGrids(GRID_TYPE.WORK);

const onSelect = ({ key = 0 }) => {
    active.value = key;
}
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
/**
 * 随机数
 * @param n 传入数量
 * @param mean 均值
 * @param ratio 系数，控制标准差大小
 */
function generateCardChange(n: number, mean = 0, ratio = 1) {
    const variance = n * ratio;
    // 使用Box-Muller变换生成正态分布随机数
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    let change = mean + Math.sqrt(variance) * z0;
    // 在 -n, n范围内截断(不知道重roll会不会好一点)
    change = Math.max(-n, change);
    change = Math.min(n, change);

    return Math.round(change);
}

/** 开始赌卡！ */
const gamblingCard = (information = '') => {
    if (!customCard.value) return;
    if (customCard.value.quantity > Math.floor(customCard.value.item.stack / 2)) {
        ElMessage.error('卡片不能超过最大堆叠数量的一半!');
        return;
    }
    const range = customCard.value.quantity;
    const trend = playerStore.setting.trend;
    const ratio = playerStore.setting.ratio;
  
    const randomNum = generateCardChange(range, range * (trend / 100), ratio);
    // console.log(randomNum)
    logStore.SET_RECORD({
        itemId: customCard.value.itemId,
        num: randomNum,
        type: 1,
        originNum: customCard.value.quantity,
        information
    });
    playerStore.SET_ITEMS_NUM(customCard.value.id, customCard.value.quantity + randomNum);
};

const createCard = () => {
    // 生成一张卡
    const itemId = HIGH_VALUE_LIST[random.int(0, HIGH_VALUE_LIST.length)];
    const item = playerStore.FIND_ITEM_DETAIL(itemId);
    if (!item) return;
    // 发到工作台
    const newItem = playerStore.CREATE_ITEM({
        itemId,
        // 随机堆叠一半以内的数量
        quantity: random.int(1, Math.floor(item.stack / 2)),
        position: GRID_TYPE.PACK,
        gridId: ''
    });
    playerStore.AUTO_MOVE({
        ...newItem,
        item
    }, GRID_TYPE.PACK);
};
const running = () => {
    // 不存在生成一张
    if (!customCard.value) {
        createCard();
        gamblingCard('auto');
        return;
    }
    if (customCard.value.quantity > Math.floor(customCard.value.item.stack / 2)) {
        // 超出后先清空
        playerStore.REMOVE_ALL_ITEM();
        createCard();
    }
    gamblingCard('auto');
}
/** 自动化测试 */
const autoWork = () => {
    let count = 0; // 初始化计数器

    while (count < 100) {
        // 在此处执行你想要的操作
        running();
        count++; // 增加计数器
    }
};
</script>

<style lang="less">
@import url('./index.less');
</style>
