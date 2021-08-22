import './App.css';
import { Provider } from 'react-redux';
import store from './Redux/Store/store';
import TableDynamic from './components/TableDynamic';

import { BrowserRouter as Router } from 'react-router-dom';
function App() {
  return (
      <Provider store={store}>
        <div className="App">
          <TableDynamic/>
     </div>
      </Provider>
  );
}

export default App;
