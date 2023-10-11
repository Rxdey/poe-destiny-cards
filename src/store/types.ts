import { UserItemType, CardData } from '@/types/data';

/** 背包格子 */
export type Grids = {
    id: string;
    x?: number;
    y?: number;
    type: UserItemType['position'],
    inner?: PackItem
};

/** 背包物品 */
export type PackItem = (UserItemType & { item: CardData });