import { useRuntimeStore } from '../store/runtime';
import { useInventoryStore } from '../store/inventory';

export default function selectDate(productName: string, ean?: string, imageUrl?: string) {
  const setCurrentProductId = useRuntimeStore(state => state.setCurrentProductId);
  const addInventoryItem = useInventoryStore(state => state.addInventoryItem);
  const setSelectingDate = useRuntimeStore(state => state.setSelectingDate);


  if (!productName) return;

  const newItem = addInventoryItem({
    ean,
    name: productName,
    photoUrl: imageUrl,
  });

  setCurrentProductId(newItem.id);
  setSelectingDate(true);
}
