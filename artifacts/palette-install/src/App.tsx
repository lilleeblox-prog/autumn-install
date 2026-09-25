import { Route, Switch } from 'wouter';
import { Shell } from './components/Shell';

import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Studio from './pages/Studio';
import Process from './pages/Process';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import NotFound from './pages/not-found';

function App() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/packages" component={Packages} />
        <Route path="/packages/:id" component={PackageDetail} />
        <Route path="/studio" component={Studio} />
        <Route path="/process" component={Process} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/faq" component={Faq} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

export default App;
