<template>
    <el-popover placement="top" :width="180" trigger="hover" effect="dark" :show-arrow="false" popper-style="background-color: transparent;border:none;padding-bottom: 0;pointer-events: none;" :disabled="moveable" v-if="data && data.item" :hide-after="0" :show-after="200">
        <template #reference>
            <div class="mini-item-icon" :class="{ moveable }" @click.stop="onClick" ref="custom">
                <img src="/img/InventoryIcon.webp">
                <div class="card-num" :class="{ full: data.quantity === data.item.stack }">{{ data.quantity }}</div>
            </div>
        </template>
        <DivinationCard class="ignore" :type="data.item?.type" :quantity="data.quantity" />
    </el-popover>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DivinationCard from '../DivinationCard/DivinationCard.vue';
import { PackItem } from '@/store/types';
import userPlayerStore from '@/store/modules/userPlayerStore';
import { GRID_TYPE } from '@/data/const.data';

const playerStore = userPlayerStore();

type Props = {
    data: PackItem,
    position: GRID_TYPE,
    currentXY?: {
        clientX: number,
        clientY: number
    }
};

const emit = defineEmits(['gridClick']);
const props = withDefaults(defineProps<Props>(), {
    // data,
    // position: null
});

const moveable = ref(false);
const custom = ref<HTMLDivElement | null>(null);

const mouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (!custom.value) return;
    custom.value.style.left = `${clientX}px`;
    custom.value.style.top = `${clientY}px`;
};
/** 拆分 */
const splitItems = () => { };
/** 移动 */
const moveItems = () => {
    /** 背包信息 */
    const gridInfo = props.position === GRID_TYPE.PACK ? playerStore.WORK_GRIDS : playerStore.PACK_GRIDS;
    // 查找目标出存在的相同物品且堆叠没满的格子, 如果没有则查找所有最近的空格
    if (!props.data.item) return;
    const targetGrid = gridInfo.filter((item, i) => {
        return (item.inner && props.data && item.inner.itemId === props.data.itemId && item.inner.item.stack > item.inner.quantity) || !item.inner;
    });
    for (let index = 0; index < targetGrid.length; index++) {
        if (!props.data || !props.data.item) break;
        const el = targetGrid[index];
        if (!el.inner) {
            if (props.data.quantity <= props.data.item.stack) {
                playerStore.UPDATE_ITEM_POSITION({
                    gridId: el.id,
                    id: props.data.id,
                    position: el.type,
                });
                break;
            }
        } else {
            playerStore.UPDATE_ITEM_POSITION({
                gridId: el.id,
                id: props.data.id,
                position: el.type,
            });

        }
    }
}
/** 点击 */
const onClick = (event: MouseEvent) => {
    if (moveable.value || !props.data) return;
    // 如果鼠标位置存在物品，透传到格子
    if (playerStore.MOUSE_ITEM) {
        emit('gridClick', event)
        return;
    }
    // 检查 Ctrl 键是否按下
    if (event.ctrlKey) {
        // moveItems();
        playerStore.AUTO_MOVE(props.data, props.position);
        return;
    }
    // 检查 Ctrl 键是否按下
    if (event.shiftKey) {
        splitItems();
        return;
    }
    playerStore.UPDATE_ITEM_POSITION({
        gridId: 'mouse',
        id: props.data.id,
        position: GRID_TYPE.MOUSE,
    });
}
/** 结束移动 */
const handleReset = () => {
    if (!custom.value) return;
    moveable.value = false;
    document.body.removeEventListener('mousemove', mouseMove)
}

onMounted(() => {
    // 如果在鼠标位置，跟随鼠标移动
    if (props.position === GRID_TYPE.MOUSE) {
        moveable.value = true;
        document.body.addEventListener('mousemove', mouseMove)
        const mouseEvent = new MouseEvent("mousemove", props.currentXY);
        document.body.dispatchEvent(mouseEvent);
    }
})
onBeforeUnmount(() => {
    handleReset();
});

</script>

<style lang="less" scoped>
.mini-item-icon {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .card-num {
        position: absolute;
        top: 0;
        left: 5px;
        color: #fff;
        font-size: 11px;
        font-weight: bold;

        &.full {
            color: #00bafe;
        }
    }

    &.moveable {
        position: fixed;
        z-index: 1000;
        pointer-events: none;
    }
}

.ignore {
    pointer-events: none;
}
</style>
