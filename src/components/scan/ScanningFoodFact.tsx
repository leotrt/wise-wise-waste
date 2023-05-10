import { useQuery } from 'react-query';
import Spinner from './Spinner';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { useRuntimeStore } from '../../store/runtime';
import { useInventoryStore } from '../../store/inventory';
import { AnimatePresence, motion } from 'framer-motion';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface ScanningFoodFactProps {
  ean: string;
}

export interface FoodFactResponse {
  product: FoodFact;
  status: string;
  errors: unknown[];
}

export interface FoodFact {
  product_name: string;
  image_front_small_url: string;
}

export interface FoodFactError {
  message: string;
}

const loadFoodFact = async (ean: string) => {
  const res = await fetch(`https://fr.openfoodfacts.org/api/v3/product/${ean}?fields=product_name,image_front_small_url`);
  return res.json();
}

const ScanningFoodFact: React.FC<ScanningFoodFactProps> = ({ ean }: ScanningFoodFactProps) => {
  const {
    isLoading,
    data,
    error
  } = useQuery<any, FoodFactError, FoodFactResponse, string>(`foodFact-${ean}`, () => loadFoodFact(ean));

  const setCurrentProductId = useRuntimeStore(state => state.setCurrentProductId);
  const addInventoryItem = useInventoryStore(state => state.addInventoryItem);
  const setSelectingDate = useRuntimeStore(state => state.setSelectingDate);
  const setCurrentEan = useRuntimeStore(state => state.setCurrentEan);
  const setSearching = useRuntimeStore(state => state.setSearching);

  const selectDate = () => {
    if (!data) return;

    const newItem = addInventoryItem({
      ean,
      name: data.product.product_name,
      photoUrl: data.product.image_front_small_url,
    });

    setCurrentProductId(newItem.id);
    setSelectingDate(true);
    setCurrentEan(null);
  }

  const noProduct = error?.message || !data || data.errors?.length;

  // We can assume by this point that `isSuccess === true`
  return <AnimatePresence>
    {(isLoading && <motion.div animate={{ opacity: 1 }}
                               key="loading"
                               exit={{ opacity: 0 }}
                               transition={{ duration: .3 }}
                               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner/>
    </motion.div>)}

    {(!isLoading &&
        <motion.div initial={{ x: '100vw' }}
                    animate={{ x: 0 }}
                    key={'scanningResult'}
                    transition={{ type: 'spring', bounce: .4 }}
                    className="w-screen h-full flex flex-col items-center gap-10 py-4">
          {
            (<>
              <div className={'flex flex-col gap-4 w-full px-4 justify-center flex-1 items-center'}>
                {data?.product && <img className={'scan-img rounded-2xl p-2 w-fit'}
                                       src={data!.product.image_front_small_url}
                                       alt={data!.product.product_name}/>}
                <span
                className={`w-full scan-label px-3 py-2 font-bold font-mono ${noProduct ? 'text-5xl' : ''}`}>{
                  noProduct ? 'Produit non trouvé 😖' : data.product.product_name
                }</span>
              </div>
              <div className={'flex items-center gap-4 w-full justify-center px-4'}>
                <div className={'flex flex-col gap-3'}>
                  <button onClick={() => {
                    setCurrentEan(null);
                    setSearching(true);
                  }}
                          className={`rotate-1 btn rounded-[2rem] px-4 py-2 flex gap-3 justify-center items-center`}>
                    <PencilSquareIcon className="h-[5rem] w-[5rem]"/>
                    <span className={'text-6xl uppercase font-display font-extrabold'}>Saisie</span>
                  </button>

                  {(!noProduct || error) && <button onClick={selectDate}
                                                    className={'-rotate-1 btn rounded-[2rem] py-2 gap-3 justify-center secondary px-4 flex items-center'}>
                      <ChevronDoubleRightIcon className="h-[5rem] w-[5rem]"/>
                      <span className={'text-6xl uppercase font-display font-extrabold'}>Suivant</span>
                  </button>}
                </div>
              </div>
            </>)
          }
        </motion.div>
    )}
  </AnimatePresence>
}

export default ScanningFoodFact;
