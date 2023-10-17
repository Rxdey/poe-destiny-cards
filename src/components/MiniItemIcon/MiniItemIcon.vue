<template>
    <el-popover placement="top" :width="160" effect="dark" :show-arrow="false" :popper-style="popupStyle" :disabled="moveable || dragable" v-if="data && data.item" :hide-after="0" :show-after="0" :offset="0" :fallbackPlacements="['left-start']" transition="none" :visible="show">
        <template #reference>
            <div class="mini-item-icon" :class="{ moveable }" @click.stop="onClick" ref="custom" @mouseover="onMouseOver" @mouseout="onMouseOut" @mouseleave="onMouseOut" draggable="true" @dragstart="dragstart" @drag="drag" @dragend="dragend">
                <img src="/img/InventoryIcon.webp" draggable="false">
                <div class="card-num" :class="{ full: data.quantity === data.item.stack }">{{ data.quantity }}</div>
            </div>
        </template>
        <div v-if="show">
            <DivinationCard class="ignore" :type="data.item?.type" :quantity="data.quantity" v-if="!showSplit" />
            <div v-else class="split-bar" @mousedown.stop>
                <Slider :min="0" :max="Math.min(data.item.stack, data.quantity)" v-model="splitVal" />
                <div class="split-button">
                    <el-button type="info" :icon="Check" circle size="small" @click="onSubmitSplit" />
                </div>
            </div>
        </div>
    </el-popover>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeUnmount, StyleValue } from 'vue';
import { Check } from '@element-plus/icons-vue'
import DivinationCard from '../DivinationCard/DivinationCard.vue';
import { PackItem } from '@/store/types';
import usePlayerStore from '@/store/modules/usePlayerStore';
import { GRID_TYPE } from '@/data/const.data';
import Slider from '../slider/slider.vue';

const playerStore = usePlayerStore();

const popupStyle: StyleValue = {
    'background-color': 'transparent',
    'border': 'none',
    'padding': 0,
    'pointer-events': 'none',
    'line-height': 1
};
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

const show = ref(false);
const moveable = ref(false);
const dragable = ref(false);
const showSplit = ref(false);
// 分割数量
const splitVal = ref(1);

const inputVal = ref('');

const custom = ref<HTMLDivElement | null>(null);

const dragstart = (e: DragEvent) => {
    // console.log(e);
    dragable.value = true;
    if (!e.dataTransfer) return;
    e.dataTransfer.setData('dragItemId', props.data.id);
}
const drag = (e: DragEvent) => {
    // console.log(e);
};
const dragend = (e: DragEvent) => {
    // console.log('end');
    dragable.value = false;
};

/** 确认拆分 */
const onSubmitSplit = () => {
    // reset后重置，要在之前取值
    const val = splitVal.value;
    console.log(val);
    playerStore.SPLIT_SINGLE_ITEMS({
        gridId: 'mouse',
        id: props.data.id,
        position: GRID_TYPE.MOUSE,
        num: val
    })
    resetSplit();
};
/** 移除拆分 */
const resetSplit = () => {
    show.value = false;
    showSplit.value = false;
    splitVal.value = 1;
    document.body.onmousedown = null;
    document.body.onkeydown = null;
    document.body.onkeyup = null;
};
/** 拆分 */
const splitItems = () => {
    showSplit.value = true;
    show.value = false;
    setTimeout(() => {
        show.value = true;
    }, 0);
    document.body.onmousedown = resetSplit;
    document.body.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSubmitSplit();
            return;
        }
        if (/\d/.test(e.key)) {
            inputVal.value += e.key;
            // console.log(inputVal.value)
            if (parseInt(inputVal.value) < Math.min(props.data.item.stack, props.data.quantity)) {
                splitVal.value = parseInt(inputVal.value);
            } else {
                splitVal.value = Math.min(props.data.item.stack, props.data.quantity);
            }
        }
    }
    let st: number | null = null;
    document.body.onkeyup = (e: KeyboardEvent) => {
        if (/\d/.test(e.key)) {
            if (st) window.clearTimeout(st);
            st = setTimeout(() => {
                inputVal.value = '';
            }, 100);
        }
    }
};
/** 点击 */
const onClick = (event: MouseEvent) => {
    // 鼠标物品需要初始化定位
    playerStore.SET_GLOBAL_XY({
        clientX: event.clientX,
        clientY: event.clientY
    });
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
    // 检查 shift 键是否按下
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
/** 目标位置在鼠标上时，跟随鼠标移动 */
const mouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (!custom.value) return;
    custom.value.style.left = `${clientX}px`;
    custom.value.style.top = `${clientY}px`;
};

/** 结束移动 */
const handleReset = () => {
    const dragObj = document.querySelector('.drag-obj');
    if (dragObj) {
        document.body.removeChild(dragObj);
    }
    if (!custom.value) return;
    moveable.value = false;
    document.body.removeEventListener('mousemove', mouseMove)
}

/** 自定义popover显示 */
const onMouseOut = () => {
    if (showSplit.value) return;
    show.value = false;
};
const onMouseOver = () => {
    show.value = true;
};

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

.split-bar {
    width: 160px;
    background-color: rgb(24, 19, 15);
    border: 1px solid rgb(76, 51, 31);
    pointer-events: all;
    margin: 0 auto;
    color: rgb(144, 138, 132);
    padding: 10px 0 5px 0;

    .split-button {
        padding: 10px 5px 0 0;
        text-align: right;
    }
}
</style>
