import './ScannerUI.scss';
import bip from '../../assets/bip.svg';
import { motion } from 'framer-motion';

const ScannerUI = () => {
  return (
  <motion.div className="scanner-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}>
    <div>
      <motion.img src={bip} animate={{
        scale: [1, 1.1, 1]
      }} transition={{
        repeat: Infinity,
        repeatDelay: 2,
        duration: .1
      }}/>
    </div>
    <div>
      <div>
      </div>
      <div>
        <div className={'scanner-line'}></div>
      </div>
      <div></div>
    </div>
    <div></div>
  </motion.div>
  )
}

export default ScannerUI;
