import { CARD_POOL  } from '@/data/card.data';
import { v4 as uuidv4 } from 'uuid';

export const GenerateCard = ({ type = '' }) => {
    if (!type) return;
    const card = CARD_POOL.find(item => item.type === type);
    if (!card) return;
    return {
        id: uuidv4(),
        item: card
    }
}