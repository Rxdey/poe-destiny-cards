<template>
    <div class="slider">
        <div class="slider-left">
            <div class="slider-text">{{ start }}</div>
        </div>
        <div class="slider-center">
            <div class="slider-inner" ref="inner" @mousedown.stop="onInnerClick">
                <div class="slider-block" @mousedown.stop="onSliderClick" :style="{ left: `${left}px` }"></div>
            </div>
        </div>
        <div class="slider-right">
            <div class="slider-text">{{ modelValue }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 0
    },
    step: {
        type: Number,
        default: 1
    },
    modelValue: {
        type: Number,
        default: 0
    }
});

const start = computed(() => props.max - props.modelValue);

const inner = ref<HTMLDivElement | null>(null);
const left = ref(0);

const onSliderClick = (e: any) => {
    const startX = e.clientX;
    if (!inner.value) return;
    const width = inner.value.clientWidth - 10;
    const startLeft = parseFloat(e.target.style.left);
    const mouseMoveFun = (event: MouseEvent) => {
        let moveX = (event.clientX - startX) + startLeft;
        if (moveX <= 0) moveX = 0;
        if (moveX >= width) moveX = width;
        left.value = moveX;
        const stepVal = props.max / props.step;
        const percentage = (moveX / width);
        // end.value = Math.ceil(stepVal * percentage);
        emit('update:modelValue', Math.ceil(stepVal * percentage));
    }
    document.body.addEventListener('mousemove', mouseMoveFun);
    document.body.onmouseup = () => {
        document.body.removeEventListener('mousemove', mouseMoveFun);
    };
};

const onInnerClick = (e: MouseEvent) => {
    // console.log(e);
    if (!e.target) return;
    // console.log();
    const { left: ractLeft } = (e.target as HTMLDivElement).getBoundingClientRect();
    const mouseX = e.clientX - ractLeft;
    if (mouseX > left.value) {
        if(props.modelValue + 1 < props.max) emit('update:modelValue', props.modelValue + 1);
    } else {
        if(props.modelValue - 1 > 0) emit('update:modelValue', props.modelValue - 1);
    }
};
// onMounted(() => {
//     if (!inner.value) return;
//     left.value = (inner.value.clientWidth - 10) * (props.modelValue / props.max);
// });
watch(() => props.modelValue, (val) => {
    if (!inner.value) return;
    left.value = (inner.value.clientWidth - 10) * (val / props.max);
}, {
    immediate: true
})

</script>

<style lang="less" scoped>
.slider {
    height: 20px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 12px;
    user-select: none;
}

.slider-left,
.slider-right {
    width: 25px;
    text-align: center;
    white-space: nowrap;
    position: relative;
}

.slider-left {
    .slider-text {
        right: 0;
    }
}

.slider-right {
    .slider-text {
        left: 0;
    }
}

.slider-text {
    min-width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
}

.slider-center {
    flex: 1;
}

.slider-inner {
    width: 100%;
    height: 15px;
    background-color: rgb(0, 0, 0);
    position: relative;

    .slider-block {
        position: absolute;
        width: 10px;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgb(76, 51, 31);
    }
}
</style>
