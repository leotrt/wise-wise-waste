import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRuntimeStore } from '../store/runtime';

const BackToHomeButton = () => {
  const setSearching = useRuntimeStore(state => state.setSearching);
  const setCurrentProductId = useRuntimeStore(state => state.setCurrentProductId);
  const setScanning = useRuntimeStore(state => state.setScanning);
  const setSelectingDate = useRuntimeStore(state => state.setSelectingDate);
  const setCurrentEan = useRuntimeStore(state => state.setCurrentEan);

  function back() {
    setSearching(false);
    setCurrentProductId(null);
    setScanning(false);
    setSelectingDate(false);
    setCurrentEan(null);
  }

  return <button onClick={back}
                 className="mt-safe btn regular bg-slate-300 absolute top-4 left-4 rounded-full rotate-12 z-50 p-4">
    <ArrowLeftIcon className={'h-12 w-12'}/>
  </button>
}

export default BackToHomeButton;
