import { useInView } from 'react-intersection-observer';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

export interface WheelItemProps {
  date?: Date,
  setSelectedDate?: Dispatch<SetStateAction<Date | null>>
  forceSelected?: (ref: React.MutableRefObject<HTMLDivElement | null>) => void
  spacer?: boolean
}

export default function WheelItem({ setSelectedDate, date, spacer, forceSelected }: WheelItemProps) {
  const [ref, inView, entry] = useInView({
    threshold: 0.5,
    rootMargin: '-45.4545% 0px -45.4545% 0px',
  });
  const timeoutRef = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  useEffect(() => {
    if (entry?.isIntersecting && date) {
      timeoutRef.current = window.setTimeout(() => {
        setSelectedDate && setSelectedDate(date!);
      }, 500);
    }
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [date, entry?.isIntersecting, setSelectedDate]);


  return <div ref={divRef}>
    <div ref={ref} onClick={() => {
      forceSelected && forceSelected(divRef)
    }}
         className={`${!spacer ? 'border-t border-solid border-t-gray-300' : ''} font-display transition-all text-center w-screen h-[9.0909vh] ${date ? 'leading-[9.0909vh]' : ''} ${inView ? 'text-4xl font-bold text-primary' : `${date ? 'text-3xl' : ''}`}`}
         style={{ filter: inView ? 'drop-shadow(0 1.2px black) drop-shadow(2px 2px 0 black)' : 'none' }}
    >
      <span
      className={`uppercase font-${inView ? 'bold' : 'thin'}`}>{date?.toLocaleString('default', { dateStyle: 'long' })}</span>
    </div>
  </div>
}
