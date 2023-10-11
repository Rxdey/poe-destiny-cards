<template>
    <div class="pack">
        <div class="pack-grid">
            <div class="pack-item" :class="{ hover: !!item.inner }" v-for="item in packGrids" :key="item.id" @click="onGridClick($event, item)">
                <div v-if="item.inner">
                    <MiniItemIcon :data="item.inner" :position="GRID_TYPE.PACK" @gridClick="onGridClick($event, item)" />
                </div>
            </div>
        </div>
        <div class="pack-tool">
            <el-button type="info" @click="giveMeCard">给我卡(随机高价值)</el-button>
            <el-button type="info" @click="showLog">赌狗日记</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import MiniItemIcon from '@/components/MiniItemIcon/MiniItemIcon.vue';
import userPlayerStore from '@/store/modules/userPlayerStore';
import { Grids } from '@/store/types';
import { GRID_TYPE } from '@/data/const.data';
import { eventBus } from '@/store/bus';
import random from 'random';

const playerStore = userPlayerStore();

const packGrids = computed(() => playerStore.PACK_GRIDS);

/** 鼠标单张放置 */
const splitSingleItems = (data: Grids) => {
    if (!playerStore.MOUSE_ITEM) return;
    const { type, id } = data;
    playerStore.SPLIT_SINGLE_ITEMS({
        gridId: id,
        id: playerStore.MOUSE_ITEM.id,
        position: type
    });
};
const onGridClick = (event: MouseEvent, data: Grids) => {
    if (!playerStore.MOUSE_ITEM) return;
    const { type, id } = data;
    // 检查 Shift 键是否按下
    if (event.shiftKey) {
        splitSingleItems(data);
        return;
    }
    playerStore.UPDATE_ITEM_POSITION({
        gridId: id,
        id: playerStore.MOUSE_ITEM.id,
        position: type
    });
};

const showLog = () => {
    ElMessage.warning('还没写好');
    // const str = `${}`;
    console.log(playerStore.record);
};

const giveMeCard = () => {
    const cardLength = playerStore.player.items.reduce((p, n) => {
        p += n.quantity;
        return p;
    }, 0)
    if (cardLength >= 5) {
        ElMessage.warning('麻烦输完了再来！');
        return;
    }
    const cardList = [
        'the-apothecary',
        'house-of-mirrors',
        'the-nurse',
        'the-insane-cat',
        'the-fiend',
        'the-price-of-devotion',
        'unrequited-love',
        'the-demon',
    ];
    const itemId = cardList[random.int(0, cardList.length)];
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
    playerStore.SET_RECORD(itemId, 1, 2);
};

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
