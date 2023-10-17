

import { Grids, PackItem } from '@/store/types';
import { GRID_TYPE } from '@/data/const.data';
import usePlayerStore from '@/store/modules/usePlayerStore';

export const useGrids = (position: GRID_TYPE) => {

    const playerStore = usePlayerStore();
    const dragenter = (e: DragEvent) => {
        e.preventDefault();
        if (!e.target) return;
        (e.target as any).toggleAttribute('over', true);
    };
    const dragleave = (e: DragEvent) => {
        e.preventDefault();
        if (!e.target) return;
        (e.target as any).toggleAttribute('over', false);
    };
    const drop = (e: DragEvent, data: Grids) => {
        e.preventDefault();
        if (!e.target || !e.dataTransfer) return;
        (e.target as any).toggleAttribute('over', false);
        const id = e.dataTransfer.getData('dragItemId');
        if (!id) return;
        // 拖拽到原格不处理
        if (id === data.inner?.id) return;
        const detail = playerStore.GET_ITEM_BY_ID(id);
        if (!detail) return;
        onGridClick(e, data, { id: detail.id });
    };

    /** 鼠标单张放置 */
    const splitSingleItems = (data: Grids) => {
        if (!playerStore.MOUSE_ITEM) return;
        const { type, id } = data;
        playerStore.SPLIT_SINGLE_ITEMS({
            gridId: id,
            id: playerStore.MOUSE_ITEM.id,
            position: type
        });
    };
    /**
     * @param event MouseEvent
     * @param data 当前格子信息
     * @param from 即将放置的数据
     */
    const onGridClick = (event: MouseEvent, data: Grids, transferData?: { id: string }) => {
        const origin = transferData || playerStore.MOUSE_ITEM;
        if (!origin) return;
        const { type, id } = data;
        // 检查 Shift 键是否按下
        if (event.shiftKey) {
            splitSingleItems(data);
            return;
        }
        playerStore.UPDATE_ITEM_POSITION({
            gridId: id,
            id: origin.id,
            position: type
        });
    };
    return {
        dragenter,
        dragleave,
        drop,
        onGridClick
    }
}