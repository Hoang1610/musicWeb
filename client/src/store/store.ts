import { legacy_createStore as createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer/rootReducer";
import { thunk } from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
