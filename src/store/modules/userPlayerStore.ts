import { defineStore } from 'pinia'
import { PLAYER_DATA } from '@/data/player.data';
import { PlayerData, UserItemType } from '@/types/data';
import { Grids, PackItem } from '@/store/types';
import { CARD_POOL } from '@/data/card.data';
import { GRID_TYPE } from '@/data/const.data';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const grids: Grids[] = [...Array(144)].map((item, i) => ({
    id: `pack-${i + 1}`,
    x: i % 12,
    type: GRID_TYPE.PACK,
    y: Math.floor(i / 12),
}));

// 遴选部分改为可选值
type CreateDocumentOptions<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// type CustomVideoData = CreateDocumentOptions<VideoDetail, 'id'|'cover'>|null;
interface MainState {
    player: PlayerData,
    records: any,
    globalXY: {
        clientX: number,
        clientY: number,
    }
}

type UpdateItemPosition = {
    /** 目标位置id */
    gridId: string,
    /** 当前位置 */
    position: UserItemType['position'],
    /** 物品记录id */
    id: string
};

const userPlayerStore = defineStore('player', {
    state: (): MainState => ({
        player: PLAYER_DATA,
        globalXY: {
            clientX: 0,
            clientY: 0
        },
        records: []
    }),
    actions: {
        SET_GLOBAL_XY (data: MainState['globalXY']) {
            this.globalXY = data;
        },
        /** 调整物品数量 */
        SET_ITEMS_NUM(id: string, num: number) {
            if (num <= 0) {
                this.REMOVE_ITEM(id);
                return;
            }
            const current = this.GET_ITEM_BY_ID(id);
            if (!current) return;
            current.quantity = num;
        },
        /** 移除物品 */
        REMOVE_ITEM(id: string) {
            this.player.items = this.player.items.filter(item => item.id !== id);
        },
        /** 移除物品 */
        REMOVE_ALL_ITEM() {
            this.player.items = [];
        },
        /** 查找物品 */
        GET_ITEM_BY_ID(id: string) {
            return this.player.items.find(item => item.id === id);
        },
        /** 根据id查询物品完整信息 */
        FIND_ITEM_DETAIL(id: string) {
            return CARD_POOL.find(c => c.id === id);
        },
        /** 创建新物品 */
        CREATE_ITEM({ itemId, quantity, position, gridId }: Omit<UserItemType, 'id'>) {
            const id = uuidv4();
            const newItem = {
                id,
                itemId,
                quantity,
                position,
                gridId
            };
            this.player.items.push(newItem);
            return newItem;
        },
        /**
         * 物品带数量移动(暂用于shift拆分)
         * @param id 当前堆叠记录ID
         * @param gridId 目标格子ID
         * @param position 目标格子位置
         * @returns 
         */
        SPLIT_SINGLE_ITEMS({ gridId, id, position, num = 1 }: UpdateItemPosition & { num?: number }) {
            // 查找当前坐标
            const current = this.GET_ITEM_BY_ID(id);
            if (!current) return;
            /** 查找目标位置信息 */
            const target = this.player.items.find(item => item.gridId === gridId);
            // 不存在创建一个新堆叠
            if (!target) {
                this.SET_ITEMS_NUM(current.id, current.quantity - num)
                this.CREATE_ITEM({
                    itemId: current.itemId,
                    quantity: num,
                    position: position,
                    gridId
                });
                return;
            };
            // 不同道具 不处理
            if (target.itemId !== current.itemId) return;
            const ITEM = this.FIND_ITEM_DETAIL(target.itemId);
            // 堆叠数超过最大不处理
            if (!ITEM || target.quantity + num > ITEM?.stack) return;
            if (num > current.quantity) return;
            this.SET_ITEMS_NUM(current.id, current.quantity - num)
            this.SET_ITEMS_NUM(target.id, target.quantity + num);
        },
        /**
         * 移动物品
         * @param id 当前堆叠记录ID
         * @param gridId 目标格子ID
         * @param position 目标格子位置
         * @returns 
         */
        UPDATE_ITEM_POSITION({ gridId, id, position }: UpdateItemPosition) {
            /** 当前物品 */
            const current = this.GET_ITEM_BY_ID(id);
            if (!current) return;
            /** 查找目标位置信息 */
            const target = this.player.items.find(item => item.gridId === gridId);
            /** 如果目标位置为空，直接置入 */
            if (!target) {
                current.position = position;
                current.gridId = gridId;
                return;
            }
            // 如果目标和当前非同一个物品，交换位置
            if (target.itemId !== current.itemId) {
                [target.position, target.gridId, current.position, current.gridId] = [current.position, current.gridId, target.position, target.gridId];
                return;
            }
            const ITEM = this.FIND_ITEM_DETAIL(target.itemId);
            if (!ITEM) return;
            // 如果堆叠小于最小堆叠
            if (target.quantity + current.quantity <= ITEM.stack) {
                this.REMOVE_ITEM(current.id);
                this.SET_ITEMS_NUM(target.id, target.quantity + current.quantity);
                return;
            }
            // 如果堆叠大于最小堆叠
            const overNum = (target.quantity + current.quantity) - ITEM.stack;
            this.SET_ITEMS_NUM(target.id, ITEM.stack);
            this.SET_ITEMS_NUM(current.id, overNum);
        },
        /** 移动，自动填充 */
        AUTO_MOVE(itemDetail: PackItem, position: GRID_TYPE) {
            /** 背包信息 */
            const gridInfo = position === GRID_TYPE.PACK ? this.WORK_GRIDS : this.PACK_GRIDS;
            // 查找目标出存在的相同物品且堆叠没满的格子, 如果没有则查找所有最近的空格
            if (!itemDetail.item) return;
            const targetGrid = gridInfo.filter((item, i) => {
                return (item.inner && itemDetail && item.inner.itemId === itemDetail.itemId && item.inner.item.stack > item.inner.quantity) || !item.inner;
            }).sort((a, b) => {
                return (b.inner ? 1 : 0) - (a.inner ? 1 : 0);
            });
            for (let index = 0; index < targetGrid.length; index++) {
                if (!itemDetail || !itemDetail.item) break;
                const el = targetGrid[index];
                if (!el.inner) {
                    if (itemDetail.quantity <= itemDetail.item.stack) {
                        this.UPDATE_ITEM_POSITION({
                            gridId: el.id,
                            id: itemDetail.id,
                            position: el.type,
                        });
                        break;
                    }
                } else {
                    this.UPDATE_ITEM_POSITION({
                        gridId: el.id,
                        id: itemDetail.id,
                        position: el.type,
                    });

                }
            }
        },
        /**
         * 添加日志
         * @param itemId 物品id
         * @param res 数量
         * @param type 类型 1 赌卡 2 获取
         */
        SET_RECORD(itemId: string, num: number, type: number, originNum = 0) {
            const cardInfo = this.FIND_ITEM_DETAIL(itemId);
            if (!cardInfo) return;
            const data = {
                id: uuidv4(),
                date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                itemId,
                num,
                originNum,
                type,
                itemName: cardInfo.name
            };
            this.records.push(data);
            // const r = (num: number) => {
            //     if (num > 0) return `小赚 ${num} 张《${cardInfo.name}》`;
            //     if (num === 0) return '啥事都没有发生';
            //     return `血亏 ${Math.abs(num)} 张《${cardInfo.name}》`
            // };
            // const typeAction: any = {
            //     1: `赌了一手, ${r(num)}`,
            //     2: `向系统索取卡片,系统反手发你一张《${cardInfo.name}》`
            // };
            // const str = `${data.date} 你${typeAction[type]} `;
            // console.log(str)
        },
        /**
         * 清除日志
         */
        CLEAR_RECORDS() {
            this.records = [];
        }
    },
    getters: {
        /** 拆开写方便阅读 */
        /** 获取背包物品列表 */
        PACK_ITEMS(state): PackItem[] {
            return state.player.items.filter(item => item.position === GRID_TYPE.PACK && item.gridId).map((item) => ({
                ...item,
                item: CARD_POOL.find(c => c.id === item.itemId)!
            }));
        },
        /** 获取工艺台物品 */
        WORK_ITEM(state): PackItem | null {
            const card = state.player.items.find(item => item.position === GRID_TYPE.WORK);
            if (!card) return null;
            return {
                ...card,
                item: CARD_POOL.find(c => c.id === card.itemId)!
            }
        },
        /** 获取鼠标物品 */
        MOUSE_ITEM(state): PackItem | null {
            const card = state.player.items.find(item => item.position === GRID_TYPE.MOUSE);
            if (!card) return null;
            return {
                ...card,
                item: CARD_POOL.find(c => c.id === card.itemId)!
            }
        },
        /** 获取背包格子 */
        PACK_GRIDS(state): Grids[] {
            return grids.map(item => {
                const { id } = item;
                const inner = this.PACK_ITEMS.find(card => card.gridId === id);
                item.inner = inner || undefined;
                return item;
            })
        },
        /** 工艺台格子(仅一格) */
        WORK_GRIDS(): Grids[] {
            return [{
                id: 'work',
                inner: this.WORK_ITEM || undefined,
                type: GRID_TYPE.WORK
            }];
        }
    },
    persist: {
        key: 'player',
    },
});

export default userPlayerStore;