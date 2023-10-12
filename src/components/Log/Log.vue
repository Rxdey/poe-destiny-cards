<template>
    <el-drawer v-bind="$attrs" direction="rtl" size="450px">
        <template #header>
            <div class="log-header">
                <h4>赌狗日记</h4>
                <span @click="clearRecords">清除日记</span>
            </div>
        </template>
        <template #default>
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
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import userPlayerStore from '@/store/modules/userPlayerStore';

const store = userPlayerStore();

const clearRecords = () => {
    store.CLEAR_RECORDS();
}

const records = computed(() => store.records.reverse());
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

    .log-text {
        &.red {
            color: var(--color-corrupted);
        }

        &.green {
            color: var(--color-gemitem);
        }

        &.blue {
            color: var(--color-magicitem);
        }

        &.uniqueitem {
            color: var(--color-uniqueitem);
        }
    }
}
</style>
