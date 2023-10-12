<template>
    <el-drawer v-bind="$attrs" direction="rtl" size="450px" :with-header="false">
        <el-tabs v-model="active" class="demo-tabs">
            <el-tab-pane label="赌狗日记" name="1">
                <div class="clear" @click="clearRecords">清除日记</div>
                <div class="log-list" v-if="records">
                    <div class="log-item" v-for="record in records" :key="record.id">
                        <span class="log-date">{{ record.date }}</span>
                        你
                        <template v-if="record.type === 1">
                            <span class="log-text blue">小赌一手</span>
                            <span class="log-text green" v-if="record.num > 0">
                                🎉小赚🎉
                            </span>
                            <span class="log-text red" v-if="record.num < 0">
                                🤡血亏🤡
                            </span>
                            <span class="log-text" v-if="record.num === 0">
                                什么都没有发生
                            </span>
                            <span class="log-text uniqueitem" v-if="record.num !== 0">{{ record.itemName }} x{{ Math.abs(record.num) }}</span>
                        </template>
                        <template v-else>
                            <span class="log-text blue">向系统索取卡片,</span>
                            <span class="log-text"> 系统反手发你一张 </span>
                            <span class="log-text uniqueitem">{{ record.itemName }}</span>
                        </template>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="统计数据" name="2">
                <div class="probability">
                    <Vchart v-if="probability && active === '2'" :option="probability" autoresize />
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import userPlayerStore from '@/store/modules/userPlayerStore';
import Vchart from 'vue-echarts';
import opt from './opt';
import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GraphicComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';

const store = userPlayerStore();
const active = ref('1');

const clearRecords = () => {
    store.CLEAR_RECORDS();
};

const records = computed(() => store.records.reverse());

const probability = computed(() => {
    if (!records.value.length) return null;
    const totle = records.value.filter((item: any) => item.type === 1);
    const add = totle.filter((item: any) => item.num > 0);
    const minus = totle.filter((item: any) => item.num < 0);
    const unchanged = totle.filter((item: any) => item.num === 0);
    const key = ['增加', '减少', '不变'];
    return opt([add, minus, unchanged].map((item, i) => ({
        name: key[i],
        value: item.length,
    })));
});
use([
    CanvasRenderer,
    PieChart,
    GraphicComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
]);

</script>

<style lang="less" scoped>
.log-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    h4 {
        font-size: 16px;
        color: #000;
    }


}
.clear {
    text-decoration: underline;
        cursor: pointer;
        margin-bottom: 10px;
        font-size: 12px;
        color: #999;
}
.log-list {
    line-height: 1.5;
    font-size: 12px;
    color: var(--color-default);

    .log-item {
        margin-bottom: 5px;
    }
}

.red {
    color: var(--color-corrupted);
}

.green {
    color: var(--color-gemitem);
}

.blue {
    color: var(--color-magicitem);
}

.uniqueitem {
    color: var(--color-uniqueitem);
}

.probability {
    line-height: 1.5;
    width: 100%;
    height: 500px;
}
</style>
