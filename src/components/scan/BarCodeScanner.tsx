import { BarcodeScanner as Scanner } from '@capacitor-community/barcode-scanner';
import './BarCodeScanner.scss';
import ScannerUI from './ScannerUI';
import ScanningFoodFact from './ScanningFoodFact';
import { AnimatePresence, motion } from 'framer-motion';
import xIcon from '/src/assets/x.svg';
import { useRuntimeStore } from '../../store/runtime';

function CloseIcon(props: { setScanning: (value: boolean) => void }) {
  return (
  <div className="absolute top-0 right-0 mt-4 mr-4">
    <img className="h-[32px] w-[26px]" src={xIcon} onClick={() => props.setScanning(false)}/>
  </div>
  );
}

const BarCodeScanner = () => {
  const scanning = useRuntimeStore(state => state.scanning);
  const setScanning = useRuntimeStore(state => state.setScanning);
  const currentEan = useRuntimeStore(state => state.currentEan);

  const stopScanning = () => {
    setScanning(false);
    Scanner.stopScan().then();
  }

  return (
  <AnimatePresence>
    {currentEan &&
    (<motion.div className={'h-full'} key={'scanning-result'}>
      <ScanningFoodFact ean={currentEan}/>
    </motion.div>)}
    {scanning && (<>
      <CloseIcon setScanning={stopScanning}/>
      <ScannerUI/>
    </>)}
  </AnimatePresence>
  )
}

export default BarCodeScanner;
