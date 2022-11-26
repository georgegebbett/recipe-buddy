import React, { FC } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { Token } from './types/types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecipeDisplayPage } from './pages/RecipeDisplayPage';
import { AddToGrocyPage } from './pages/AddToGrocyPage';
import { SettingsPage } from './pages/SettingsPage';
import { SetupPage } from './pages/SetupPage';
import { LoginPage } from './pages/LoginPage';
import { DevPage } from './pages/DevPage';
import { AuthProvider, LoggedInUser, useAuth } from './contexts/Auth';
import { DEFAULT_ENVIRONMENT, EnvironmentContext } from './contexts/Environment';
import { refreshFold } from '@nll/datum/DatumEither';
import { pipe } from 'fp-ts/lib/function';
import { matchExhaustive } from '@practical-fp/union-types';
import { AppLayout } from './layouts/AppLayout';
import { UserProvider } from './contexts/User';

export const tokenAtom = atomWithStorage<Token>("recipe-token", {});

function App() {
  return (
    <EnvironmentContext.Provider value={DEFAULT_ENVIRONMENT}>
      <AuthProvider>
        <BrowserRouter>
          <AuthLoader/>
        </BrowserRouter>
      </AuthProvider>
    </EnvironmentContext.Provider>
  );
}

const LoggedInApp: FC<{user: LoggedInUser}> = ({user}) => (
  <UserProvider user={user}>
  <AppLayout>
    <Routes>
      <Route path="/recipes" element={<RecipeDisplayPage />} />
      <Route path="/recipes/:id" element={<AddToGrocyPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/dev" element={<DevPage />} />
    </Routes>
  </AppLayout>
  </UserProvider>
)

const LoggedOutApp: FC = (props) => (
  <AppLayout>
    <Routes>
      <Route path="/*" element={<LoginPage/>}/>
    </Routes>
  </AppLayout>
)

const AuthLoader:FC = () => {
  const { state } = useAuth()

  return pipe(
    state,
    refreshFold(
      () => null,
      () => null,
      () => null,
      a => matchExhaustive(a, {
        LoggedIn: (b) => <LoggedInApp user={b}/>,
        LoggedOut: () => <LoggedOutApp/>
      }),
    )
  )

}

export default App;
