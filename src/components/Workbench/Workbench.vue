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

/** 开始赌卡！ */
const gamblingCard = (information = '') => {
    if (!customCard.value) return;
    if (customCard.value.quantity > Math.floor(customCard.value.item.stack / 2)) {
        ElMessage.error('卡片不能超过最大堆叠数量的一半!');
        return;
    }
    const range = (customCard.value.quantity * 2);
    const randomNum = random.int(0, range);
    // 结果
    const res = randomNum - customCard.value.quantity;
    logStore.SET_RECORD({
        itemId: customCard.value.itemId,
        num: res,
        type: 1,
        originNum: customCard.value.quantity,
        information
    });
    playerStore.SET_ITEMS_NUM(customCard.value.id, customCard.value.quantity + res);
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
