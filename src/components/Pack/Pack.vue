<template>
    <div class="pack">
        <div class="pack-grid">
            <div class="pack-item" v-for="item in packGrids" :key="item.id" @click="onGridClick($event, item)" @dragenter="dragenter" @drop="drop($event, item)" @dragleave="dragleave">
                <div class="pack-item-inner" v-if="item.inner">
                    <MiniItemIcon :data="item.inner" :position="GRID_TYPE.PACK" @gridClick="onGridClick($event, item)" />
                </div>
            </div>
        </div>
        <div class="pack-tool">
            <el-button type="info" @click="giveMeCard">给我卡(随机高价值)</el-button>
            <el-button type="info" @click="showLog">赌狗日记</el-button>

            <el-popconfirm title="要移除所有卡片吗？" @confirm="removeCard" effect="dark" :width="200" confirm-button-type="info" confirm-button-text="是" cancel-button-text="否" hide-icon :hide-after="0" transition="none" placement="top">
                <template #reference>
                    <el-button type="danger">清空背包</el-button>
                </template>
            </el-popconfirm>
            <el-button type="info" @click="showSetting">设置概率</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import MiniItemIcon from '@/components/MiniItemIcon/MiniItemIcon.vue';
import usePlayerStore from '@/store/modules/usePlayerStore';
import useLogStore from '@/store/modules/useLogStore';
import { Grids, PackItem } from '@/store/types';
import { GRID_TYPE } from '@/data/const.data';
import { eventBus } from '@/store/bus';
import random from 'random';
import { HIGH_VALUE_LIST } from '@/data/card.data';
import { useGrids } from '@/hooks/useGrids';

const emit = defineEmits(['log', 'setting']);
const playerStore = usePlayerStore();
const logStore = useLogStore();
const packGrids = computed(() => playerStore.PACK_GRIDS);

const { dragenter, dragleave, drop, onGridClick } = useGrids(GRID_TYPE.PACK);

const showSetting = () => {
    emit('setting');
};
const showLog = () => {
    emit('log');
};

const giveMeCard = () => {
    const cardLength = playerStore.player.items.reduce((p, n) => {
        p += n.quantity;
        return p;
    }, 0);
    if (cardLength >= 10) {
        ElMessage.warning('麻烦输完了再来！');
        return;
    }
    const index = random.int(0, HIGH_VALUE_LIST.length - 1);
    const itemId = HIGH_VALUE_LIST[index];
    const item = playerStore.FIND_ITEM_DETAIL(itemId);
    if (!item) return;
    const newItem = playerStore.CREATE_ITEM({
        itemId,
        quantity: 1,
        position: GRID_TYPE.PACK,
        gridId: ''
    });
    playerStore.AUTO_MOVE({
        ...newItem,
        item
    }, GRID_TYPE.WORK);
    logStore.SET_RECORD({
        itemId,
        num: 1,
        type: 2
    });
};
const removeCard = () => {
    playerStore.REMOVE_ALL_ITEM();
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
