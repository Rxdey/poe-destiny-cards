<template>
    <div class="log-list" v-if="records">
        <div class="log-item" v-for="record in records" :key="record.id">
            <span class="log-text" v-if="record.information">({{ record.information }})&nbsp;</span>
            <span class="log-date">{{ record.date }}</span>
            
            <template v-if="record.type === 1">
                你放入
                <span class="log-text uniqueitem">{{ record.itemName }}&nbsp;x{{ Math.abs(record.originNum) }}&nbsp;</span>
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
                <span class="log-text blue">你向系统索取卡片,</span>
                <span class="log-text"> 系统反手发你一张 </span>
                <span class="log-text uniqueitem">{{ record.itemName }}</span>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import userPlayerStore from '@/store/modules/userPlayerStore';

const store = userPlayerStore();
const records = computed(() => store.records);
</script>

<style lang="less">
.log-list {
        line-height: 1.5;
        font-size: 12px;
        color: var(--color-default);

        .log-item {
            margin-bottom: 5px;
        }
    }
</style>
