import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query';
import Inventory from './components/inventory/Inventory';
import Content from './components/Content';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
  <QueryClientProvider client={queryClient}>
    <Inventory/>
    <Content/>
  </QueryClientProvider>
  )
}

export default App
