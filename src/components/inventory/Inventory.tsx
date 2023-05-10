import { AnimatePresence, motion, useCycle, Variants } from 'framer-motion';
import useElementSize from '../../hooks/useElementSize';
import { differenceInHours, endOfDay } from 'date-fns';
import { useInventoryStore } from '../../store/inventory';
import { useEffect, useState } from 'react';
import FridgeOpenIcon from '../../assets/fridge-open-color.svg';
import { useRuntimeStore } from '../../store/runtime';
import FridgeOpenWhiteIcon from '../../assets/fridge-open-white.svg';
import { TrashIcon } from '@heroicons/react/24/solid';

const clipPathPos = 'calc(40px + env(safe-area-inset-left)) calc(40px + env(safe-area-inset-top))';

const sidebar: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height + 60}px at ${clipPathPos})`,
    transition: {
      type: 'tween',
      duration: 0.5,
      ease: 'easeInOut'
    }
  }),
  closed: {
    clipPath: `circle(0px at ${clipPathPos})`,
    transition: {
      type: 'tween',
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

const formatDaysLeft = (dueDate: Date): string => {
  const diff = Math.floor(differenceInHours(endOfDay(new Date(dueDate)), endOfDay(new Date()))) / 24;

  let emo = '🥹';
  if (diff < 0) {
    emo = '🤮';
  } else if (diff < 1) {
    emo = '😬';
  } else if (diff < 2) {
    emo = '😕';
  } else if (diff < 3) {
    emo = '😐';
  } else if (diff < 4) {
    emo = '🙂';
  } else if (diff < 5) {
    emo = '😀';
  } else if (diff < 6) {
    emo = '😁';
  } else if (diff < 7) {
    emo = '😎';
  }

  return `${diff}j ${emo}`;
}


const Inventory: React.FC = () => {
  const [ref, { height }] = useElementSize();
  const products = useInventoryStore(state => state.inventory);
  const [fridgeOpen, toggleFridgeOpen] = useCycle(false, true);
  const [fridgeIcon, setFridgeIcon] = useState(FridgeOpenIcon);
  const [displayItems, setDisplayItems] = useState(false);
  const scanning = useRuntimeStore(state => state.scanning);
  const selectingDate = useRuntimeStore(state => state.selectingDate);
  const searching = useRuntimeStore(state => state.searching);
  const currentEan = useRuntimeStore(state => state.currentEan);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const removeItem = useInventoryStore(state => state.removeInventoryItem);

  useEffect(() => {
    if (fridgeOpen) {
      setFridgeIcon(FridgeOpenWhiteIcon);
    } else {
      setDisplayItems(false);
    }
  }, [fridgeOpen]);

  const handleAnimationComplete = () => {
    if (!fridgeOpen) {
      setFridgeIcon(FridgeOpenIcon);
    } else {
      setDisplayItems(true);
    }
  };

  const inventoryItems = products.ids
  .filter(id => products.entities[id] && products.entities[id].dueDate)
  .sort((a, b) => {
    const productA = products.entities[a];
    const productB = products.entities[b];
    return new Date(productA.dueDate!).getTime() - new Date(productB.dueDate!).getTime();
  })
  .map((id, index) => products.entities[id]);


  return <motion.div animate={fridgeOpen ? 'open' : 'closed'}
                     initial={false}
                     ref={ref}
                     className={`absolute top-0 left-0 w-screen h-screen ${scanning || selectingDate || searching || currentEan ? 'hidden' : ''}`}
                     onAnimationComplete={handleAnimationComplete}>
    <motion.div variants={sidebar}
                custom={height}
                className={'p-safe bg-secondary w-screen h-screen absolute top-0 left-0 z-20 flex flex-col'}>
      <div
      className={'flex w-full justify-center items-center pt-1 h-[5rem] border-dashed border-b-8 border-white'}>
        <h1
        className={'uppercase text-white text-3xl font-bold font-display txt-3xl-shadow-black'}>{inventoryItems.length} produits</h1>
      </div>
      {displayItems &&
          <div className={'w-full justify-center items-center flex-1 overflow-y-scroll overflow-x-hidden'}>
              <AnimatePresence>
                {inventoryItems.map(({ id, dueDate, name }, index) => {
                  return (<motion.div initial={{ opacity: 0, y: -30 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -30, animationDuration: '.15s' }}
                                      key={id}
                                      onClick={() => setSelectedProduct(selectedProduct === id ? null : id)}
                                      className={`relative border-b border-black font-semibold text-2xl font-display p-5 flex justify-between items-center`}>

                    <button
                    onClick={() => removeItem(id)}
                    className={`${selectedProduct === id ? 'translate-x-0' : 'translate-x-96'} btn tertiary absolute right-4 z-50 transition-transform`}>
                      <TrashIcon className={'h-6 w-6'}/>
                    </button>
                    <div
                    className={'w-2/3 whitespace-nowrap uppercase overflow-hidden overflow-ellipsis'}>{name}</div>
                    <div
                    className={`${selectedProduct === id ? 'opacity-0' : 'opacity-100'} flex-1 text-right text-3xl text-white txt-3xl-shadow-black transition-opacity`}>
                      {formatDaysLeft(dueDate!)}
                    </div>
                  </motion.div>
                  )
                })}
              </AnimatePresence>
          </div>
      }
    </motion.div>
    <img src={fridgeIcon}
         className={'top-safe absolute left-4 h-14 w-14 z-20 txt-3xl-shadow-black'}
         onClick={() => toggleFridgeOpen()}/>
  </motion.div>

}

export default Inventory;
