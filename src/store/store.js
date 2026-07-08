import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";

//persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ['cartInfo']
};

// combine reducers
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    userInfo: userReducer,
    cartInfo: cartReducer
});

// wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    // reducer: {
    //     userInfo: userReducer,
    //     cartInfo: cartReducer
    // }
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            // Ignore redux-persist actions
            ignoreActions: [
                "persist/PERSIST",
                "persist/REHYDRATE",
                "persist/PAUSE",
                "persist/FLUSH",
                "persist/PURGE",
                "persist/REGISTER",
            ]
        }
    })
});

export const persistor = persistStore(store);