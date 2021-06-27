import Nav from 'Components/Nav.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from 'Pages/Home';
import Record from 'Pages/Record';

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/record">
          <Record />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
