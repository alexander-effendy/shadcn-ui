// import { Button } from "./components/ui/button";
// import { Carousel, CarouselContent, CarouselItem } from "./components/ui/carousel";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
// export { Tabs, TabsList, TabsTrigger, TabsContent }
import { BrowserRouter } from 'react-router-dom';
import Pages from './Pages';

function App() {
  return (
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  );
}

export default App;
