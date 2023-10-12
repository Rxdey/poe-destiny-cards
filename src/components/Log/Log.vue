<template>
    <el-drawer v-bind="$attrs" direction="rtl" size="450px" :with-header="false">

        <el-tabs v-model="active" class="demo-tabs">
            <el-tab-pane label="赌狗日记" name="1">
                <div class="log-list" v-if="records">
                    <div class="log-item" v-for="record in records" :key="record.id">
                        <span class="log-date">{{ record.date }}</span>
                        你
                        <template v-if="record.type === 1">
                            <span class="log-text blue">小赌一手</span>
                            <span class="log-text green" v-if="record.num > 0"> 🎉小赚🎉 </span>
                            <span class="log-text red" v-if="record.num < 0"> 🤡血亏🤡 </span>
                            <span class="log-text" v-if="record.num === 0"> 什么都没有发生 </span>
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
                    <p>总计：{{ probability.totle }}</p>
                    <p>
                        增加：{{ probability.add.length }}
                        <span class="green">{{ ((probability.add.length / probability.totle) * 100).toFixed(2) }}%</span>
                    </p>
                    <p>
                        减少：{{ probability.minus.length }} 
                        <span class="red">{{ ((probability.minus.length / probability.totle) * 100).toFixed(2) }}%</span>
                    </p>
                    <p>不变：{{ probability.unchanged }} 
                        <span class="blue">{{ ((probability.unchanged / probability.totle) * 100).toFixed(2) }}%</span>
                    </p>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import userPlayerStore from '@/store/modules/userPlayerStore';

const store = userPlayerStore();
const active = ref('1');

const clearRecords = () => {
    store.CLEAR_RECORDS();
}

const records = computed(() => store.records.reverse());

const probability = computed(() => {
    const totle = records.value.filter((item: any) => item.type === 1);
    const add = totle.filter((item: any) => item.num > 0);
    const minus = totle.filter((item: any) => item.num < 0);
    return {
        totle: totle.length,
        add,
        minus,
        unchanged: totle.length - add.length - minus.length
    };
})

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

    span {
        text-decoration: underline;
        cursor: pointer;
    }
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
}
</style>
