import { useEffect, useState } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';

const useBarcodeScannerPermission = () => {

  if (!Capacitor.isNativePlatform()) {
    return {
      permissionGranted: true,
      permissionDenied: false,
      permissionChecked: true,
      requestPermission: () => Promise.resolve(),
    };
  }

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {

    const checkPermission = async () => {
      const status = await BarcodeScanner.checkPermission({ force: false });
      setPermissionChecked(true);

      if (status.granted) {
        setPermissionGranted(true);
      } else if (status.denied) {
        setPermissionDenied(true);
      }
    };

    checkPermission();
  }, []);

  const requestPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      setPermissionGranted(true);
      setPermissionDenied(true);
    } else {
      setPermissionGranted(false);
      setPermissionDenied(true);
    }
  };

  return { permissionGranted, permissionChecked, permissionDenied, requestPermission };
};

export default useBarcodeScannerPermission;
