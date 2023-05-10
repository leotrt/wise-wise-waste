import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { ChevronDoubleRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { useRuntimeStore } from '../store/runtime';
import { useInventoryStore } from '../store/inventory';
import { Product, useProductStore } from '../store/products';
import FuseResult = Fuse.FuseResult;


const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  let searchResults: FuseResult<Product>[] = [];
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedItem, setSelectedItem] = useState<string>();
  const [manualSelected, setManualSelected] = useState(false);
  const setCurrentProductId = useRuntimeStore(state => state.setCurrentProductId);
  const addInventoryItem = useInventoryStore(state => state.addInventoryItem);
  const setSelectingDate = useRuntimeStore(state => state.setSelectingDate);
  const setSearching = useRuntimeStore(state => state.setSearching);
  const products = useProductStore(state => state.products);
  const addProduct = useProductStore(state => state.addProduct);
  const [fuse, setFuse] = useState<Fuse<Product>>();

  useEffect(() => {
    setFuse(new Fuse(products, {
      keys: [{
        name: 'name',
        weight: 3
      }, {
        name: 'tags'
      }],
      threshold: 0.3
    }));
  }, [products]);

  const selectDate = () => {

    if (!manualSelected && !selectedItem) return;

    const label = selectedItem ? selectedItem.split('-') : [];

    const newItem = addInventoryItem({
      name: manualSelected ? searchQuery : label.splice(0, label.length - 1)?.join(''),
    });

    setCurrentProductId(newItem.id);
    setSearching(false);
    setSelectingDate(true);
    addProduct(newItem.name);
  }

  if (fuse && debouncedSearchQuery?.trim()?.length) {
    searchResults = fuse.search(debouncedSearchQuery.trim(), {
      limit: 10,
    });
  }

  return <div className="flex flex-col h-full w-screen">
    <div
    className="rotate-1 m-4 ml-[7rem] mt-8 border bg-slate-300 text-white h-16 min-h-[4rem] p-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_#000] flex">
      <div className="flex items-center justify-center p-2">
        <MagnifyingGlassIcon className="h-12 w-12 text-slate-900 drop-shadow-[3px_2px_#fff]"/>
      </div>
      <input type="text"
             value={searchQuery}
             className="text-3xl text-slate-900 drop-shadow-[3px_2px_#fff] font-bold bg-transparent flex-1 max-w-[calc(100%_-_4rem)] focus-visible:outline-none uppercase font-mono"
             onChange={(event) => setSearchQuery(event.target.value)}></input>

    </div>

    <div className={'flex-grow overflow-auto pt-1'}>
      <AnimatePresence>
        <motion.div key="query"
                    initial={{ x: '-100vw', y: 30 }}
                    animate={{ x: 0, y: 0 }}
                    onClick={() => {
                      setManualSelected(true);
                      setSelectedItem('');
                    }}
                    className={`${manualSelected ? 'text-primary ' : ''} px-4 py-1 pb-2 break-words text-5xl border-dashed border-b-2 border-black font-display font-bold uppercase`}>
          <span className={`${manualSelected ? 'txt-shadow-black-white ' : ''}`}>
            {searchQuery}
          </span>
        </motion.div>
        {!!searchResults?.length && searchResults.map((result, idx) => (
        // random number between -2 and 2
        // const random = ;
        <motion.div key={`${result.item.name}-${idx}}`}
                    initial={{ x: '-100vw', y: 30 }}
                    animate={{ x: 0, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedItem(`${result.item.name}-${idx}`);
                      setManualSelected(false);
                    }}
                    className={`${selectedItem === `${result.item.name}-${idx}` ? 'text-primary ' : ''} px-4 py-1 break-words text-5xl border-dashed border-b-2 border-black font-display font-bold uppercase`}>
          <span className={`${selectedItem === `${result.item.name}-${idx}` ? 'txt-shadow-black-white ' : ''}`}>
            {result.item.name}
          </span>
        </motion.div>
        ))}
      </AnimatePresence>
    </div>
    <button
    disabled={!selectedItem && !manualSelected}
    onClick={() => {
      selectDate();
    }}
    className={'-rotate-1 mt-2 mb-4 mx-4 btn rounded-[2rem] py-2 gap-3 justify-center secondary px-4 flex items-center'}>
      <ChevronDoubleRightIcon className="h-[5rem] w-[5rem]"/>
      <span className={'text-6xl uppercase font-display font-extrabold'}>Suivant</span>
    </button>
  </div>;

}

export default Search;
