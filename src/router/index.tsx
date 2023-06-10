import React from "react";
import { ErrorScreen } from "./ErrorScreen";
import { ProfileScreen } from "../auth/screens/ProfileScreen/ProfileScreen";
import { NotesScreen } from "../notes/screens/NotesScreen";
import { AuthScreen } from "../auth/screens/AuthScreen/AuthScreen";
import { routes } from "./routes";
import { AuthorizedLayout } from "./AuthorizedLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./AuthorizedRoute";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.auth} element={<AuthScreen />} />
        <Route
          path="/"
          element={
            <AuthorizedRoute>
              <AuthorizedLayout />
            </AuthorizedRoute>
          }
        >
          <Route path={routes.profile} element={<ProfileScreen />} />
          <Route path={routes.notes} element={<NotesScreen />} />
        </Route>
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </BrowserRouter>
  );
};
