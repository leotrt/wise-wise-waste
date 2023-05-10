import logo from '../assets/logo.svg';
import { DocumentMagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner as Scanner } from '@capacitor-community/barcode-scanner';
import { useRuntimeStore } from '../store/runtime';
import useBarcodeScannerPermission from '../hooks/useBarcodeScannerPermission';

const Home = () => {
  const setSearching = useRuntimeStore(state => state.setSearching);
  const setCurrentEan = useRuntimeStore(state => state.setCurrentEan);
  const setScanning = useRuntimeStore(state => state.setScanning);
  const { permissionGranted, requestPermission } = useBarcodeScannerPermission();

  if (!permissionGranted) {
    requestPermission().then();
  }

  const search = () => {
    setSearching(true);
  }

  const scan = async () => {
    if (!Capacitor.isNativePlatform()) {
      setScanning(false);
      return setCurrentEan(['3661112052638', '3661112055882', '3661112096922', '3240931545042', '3033613220062516'][Math.floor(Math.random() * 5)]);
    }
    await Scanner.hideBackground();
    setScanning(true);
    const result = await Scanner.startScan({ targetedFormats: ['EAN_13'] });
    setScanning(false);
    setCurrentEan((result.hasContent && result.content) || null);
  }

  return (
  <div className={'w-screen h-full flex flex-col p-4 justify-between'}>
    <img src={logo} className={'flex-1 max-h-[55%]'}/>
    <div className={'flex flex-col gap-3'}>
      <button
      className={`-rotate-1 btn rounded-[2rem] px-4 py-2 flex gap-3 justify-center items-center ${!permissionGranted ? 'opacity-50' : ''}`}
      disabled={!permissionGranted} onClick={search}>
        <PencilSquareIcon className="h-[5rem] w-[5rem]"/>
        <span className={'text-6xl uppercase font-display font-extrabold'}>Saisie</span>
      </button>
      <button className={'rotate-1 btn rounded-[2rem] py-2 gap-3 justify-center secondary px-4 flex items-center'}
              disabled={!permissionGranted} onClick={scan}>
        <DocumentMagnifyingGlassIcon className="h-[5rem] w-[5rem]"/>
        <span className={'text-6xl uppercase font-display font-extrabold'}>Scan</span>
      </button>
    </div>
  </div>
  )
}

export default Home;
