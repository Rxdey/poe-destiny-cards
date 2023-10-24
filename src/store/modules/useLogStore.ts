import { defineStore } from 'pinia'
import usePlayerStore from './usePlayerStore'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

interface State {
    records: any;
}

const useLogStore = defineStore('log', {
    state: (): State => ({
        records: []
    }),
    actions: {
        /**
         * 添加日志(后面可能会加字段，先用any)
         * @param itemId 物品id
         * @param res 数量
         * @param type 类型 1 赌卡 2 获取
         */
        SET_RECORD(params: any) {
            // console.log(params);
            const { itemId = '', num = 0, type = 1, originNum = 0 } = params;
            const playerStore = usePlayerStore();
            const cardInfo = playerStore.FIND_ITEM_DETAIL(itemId);
            if (!cardInfo) return;
            const data = {
                id: uuidv4(),
                date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                itemName: cardInfo.name,
                ...params
            };
            this.records.unshift(data);
        },
        /**
         * 清除日志
         */
        CLEAR_RECORDS() {
            this.records = [];
        }
    },
    getters: {

    },
    persist: {
        key: 'log',
    },
});

export default useLogStore;