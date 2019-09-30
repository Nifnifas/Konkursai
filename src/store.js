import { createStore, /*combineReducers,*/ applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/*const reducers = combineReducers({
  fake: fakeReducer,
  menu: menuReducer,
  orders: ordersReducer,
});*/

export default createStore(
  //reducers,
  applyMiddleware(thunk)
);
