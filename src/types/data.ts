import { GRID_TYPE } from '@/data/const.data';

/** 命运卡卡池 */
export type ExplicitMod = {
    type: string;
    value: string;
};
export type CardData = {
    id?: string;
    name: string;
    stack: number;
    type: string;
    flavourText: string;
    url?: string;
    icon: string;
    class: string;
    explicitMod: ExplicitMod[];
    num?: number;
};

/** 物品池 */
// export type ItemType = {
//     /** 物品唯一标识 */
//     id: string;
//     /** 类型 */
//     item: CardData;
// };

/** 用户数据 */
export type UserItemType = {
    /** 记录id */
    id: string;
    /** 用户id */
    userId?: string;
    /** 物品id */
    itemId: string;
    /** 数量 */
    quantity: number;
    /** 存储位置 */
    // position: 'work' | 'pack' | 'mouse';
    position: GRID_TYPE
    /** 存储位置坐标 */
    /** 存储位置id */
    gridId: string
};
export type PlayerData = {
    items: UserItemType[];
};