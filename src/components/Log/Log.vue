<template>
    <el-drawer v-bind="$attrs" direction="rtl" size="380px" :with-header="false">
        <el-tabs v-model="active" class="demo-tabs">
            <el-tab-pane label="赌狗日记" name="1">
                <div class="clear" @click="clearRecords">清除日记</div>
                <LogDetail />
            </el-tab-pane>
            <el-tab-pane label="统计数据" name="2">
                <div v-if="active === '2'">
                    <div class="probability">
                        <Vchart :option="filterData(0)" autoresize />
                    </div>
                    <div class="probability">
                        <Vchart :option="filterData(1)" autoresize />
                    </div>
                    <div class="probability">
                        <Vchart :option="filterData(2)" autoresize />
                    </div>
                    <div class="probability">
                        <Vchart :option="filterData(3)" autoresize />
                    </div>
                    <div class="probability">
                        <Vchart :option="filterData(4)" autoresize />
                    </div>
                    <div class="probability">
                        <Vchart :option="filterData(5, 2)" autoresize />
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import useLogStore from '@/store/modules/useLogStore';
import Vchart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GraphicComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import opt from './opt';
import LogDetail from './LogDetail.vue';

const store = useLogStore();
const active = ref('1');

const clearRecords = () => {
    store.CLEAR_RECORDS();
};

const records = computed(() => store.records);

/**
 * 创建图表数据
 * @param originNum 放入数量
 * @param compare 比较 1:等于,2:大于,0:小于
 */
const filterData = (originNum = 0, compare = 1) => {
    const totle = records.value.filter((item: any) => {
        const action: Record<number, boolean> = {
            0: item.originNum <= originNum,
            1: item.originNum === originNum,
            2: item.originNum >= originNum
        }
        return item.type === 1 && (!originNum || action[compare]);
    });
    const add = totle.filter((item: any) => item.num > 0);
    const minus = totle.filter((item: any) => item.num < 0);
    const unchanged = totle.filter((item: any) => item.num === 0);
    const key = ['增加', '减少', '不变'];
    const title = !originNum ? '总计' : `放入${originNum}张${compare === 2 ? '以上' : ''}卡片`
    return opt([add, minus, unchanged].map((item, i) => ({
        name: key[i],
        value: item.length,
    })), title);
};

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



.probability {
    line-height: 1.5;
    width: 100%;
    height: 400px;
}
</style>
