import { AnimatePresence } from 'framer-motion';
import DatesWheel from './date/DatesWheel';
import BarCodeScanner from './scan/BarCodeScanner';
import { useRuntimeStore } from '../store/runtime';
import Search from './Search';
import Home from './Home';
import BackToHomeButton from './BackToHomeButton';

const Content = () => {
  const scanning = useRuntimeStore(state => state.scanning);
  const selectingDate = useRuntimeStore(state => state.selectingDate);
  const searching = useRuntimeStore(state => state.searching);
  const currentEan = useRuntimeStore(state => state.currentEan);

  return <>
    {selectingDate || searching || currentEan ? <BackToHomeButton/> : null}
    <div className={`${scanning || selectingDate || searching ? '' : 'pt-[5rem]'} h-full`}>
      <AnimatePresence>
        {(
        selectingDate ?
        <DatesWheel key={'wheel'} transition={{ type: 'spring', duration: .6, bounce: .2 }} initial={{ y: '100vh' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100vh' }}/> :
        (searching ?
        <Search/> :
        (!scanning && !currentEan) ?
        <Home/> :
        <BarCodeScanner/>
        )
        )}
      </AnimatePresence>
    </div>
  </>
}

export default Content;
