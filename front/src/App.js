import Nav from 'Components/Nav.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from 'Pages/Home';
import Record from 'Pages/Record';
import Upload from 'Pages/Upload';
import ViewRecording from 'Pages/ViewRecording';
import View from 'Pages/View';

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/view/:rid" component={ViewRecording} />
        <Route path="/view" component={View} />
        <Route path="/record" component={Record} exact />
        <Route path="/upload" component={Upload} exact />
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
