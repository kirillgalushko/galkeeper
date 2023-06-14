import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "../user/reducer";
import { authReducer } from "../auth/reducer";
import { entitiesReducer } from "../entities/reducer";
import { syncReducer } from "../sync/reducer";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "../sagas/sagas";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "sync"],
};

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  entities: entitiesReducer,
  sync: syncReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "SET_ENTITIES",
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
        ignoredPaths: ["entities", "sync.syncedAt"],
      },
    }),
    sagaMiddleware,
  ],
});

export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
