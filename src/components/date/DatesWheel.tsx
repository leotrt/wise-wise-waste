import { forwardRef, useEffect, useRef, useState } from 'react'
import './DatesWheel.scss'
import WheelItem from './WheelItem';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { useInventoryStore } from '../../store/inventory';
import { useRuntimeStore } from '../../store/runtime';
import { motion } from 'framer-motion';

const getDates = (startDate: Date) => {
  return new Array(90).fill(0).map((_, i) => {
    const oneDayInMs = 1000 * 60 * 60 * 24;
    return new Date(startDate.getTime() + (i * oneDayInMs));
  });
}

const Wheel = forwardRef<HTMLDivElement>((props, ref) => {

  const [dates, setDates] = useState<Date[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const upsertInventoryItem = useInventoryStore(state => state.upsertInventoryItem);
  const inventory = useInventoryStore(state => state.inventory);
  const currentProductId = useRuntimeStore(state => state.currentProductId);
  const setSelectingDate = useRuntimeStore(state => state.setSelectingDate);
  const setCurrentProductId = useRuntimeStore(state => state.setCurrentProductId);

  useEffect(() => {
    const initialDates = getDates(new Date());
    setDates(initialDates);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0 });
    }
  }, [mounted]);

  const forceSelected = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function spacers(nb: number) {
    return new Array(nb).fill(0).map((_, i) => <WheelItem key={i} spacer={true}></WheelItem>)
  }

  function saveDate() {
    if (selectedDate) {
      upsertInventoryItem({
        ...inventory.entities[currentProductId!],
        dueDate: selectedDate
      });
    }
    setSelectingDate(false);
    setCurrentProductId(null);
  }

  return (<>
    <div className={'h-full'} ref={ref}>
      <div className={'w-screen h-full absolute z-[9] pointer-events-none'}
           style={{ background: 'linear-gradient(white 10%, transparent 50%, white 90%)' }}></div>
      {
      dates && (<>
        <div ref={containerRef} className={'max-h-full overflow-y-scroll ctr'}>
          {spacers(5)}
          {dates.map((date, i) => <WheelItem forceSelected={forceSelected} setSelectedDate={setSelectedDate} key={i}
                                             date={date}></WheelItem>)}
          {spacers(5)}
        </div>
      </>)
      }
      <button
      className={'-rotate-1 btn absolute bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-[2rem] py-2 gap-3 justify-center secondary px-4 flex items-center'}
      onClick={saveDate}>
        <ChevronDoubleRightIcon className={'h-[5rem] w-[5rem]'}/>
        <span className={'text-6xl uppercase font-display font-extrabold'}>suivant</span>
      </button>
    </div>
  </>)
});

const DatesWheel = motion(Wheel);

export default DatesWheel;
