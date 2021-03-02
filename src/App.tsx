import React, {useEffect, useState} from 'react';
import {Route, Redirect, Switch, BrowserRouter} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import {NavBar} from "./components/navBar/NavBar";
import Users from "./screens/users/Users";
import Fundraisers from './screens/fundraisers/Fundraisers';
import Payments from "./screens/payments/Payments";
import Achievements from "./screens/achievements/Achievements";
import BookLists from "./screens/booksLists/BookLists";
import Books from "./screens/booksLists/books/Books"
import Config from "./screens/config/Config";

import api from './utils/api';
import {IUsersTableData} from './intarfaces/IUsers';
import {URLS} from './constants/urls';
import {accessTokenName, accessTokenPath} from './constants/common';

import 'bootstrap/dist/css/bootstrap.min.css';
import "antd/dist/antd.css";
import './App.scss';


export const history = createBrowserHistory();
const url = new URL(window.location.href);
if (url.searchParams.get(accessTokenName)) {
  localStorage.setItem(accessTokenPath, url.searchParams.get(accessTokenName) || "")
};

function App() {
  const [authUser, setAuthUser] = useState<IUsersTableData>({} as IUsersTableData);

  useEffect(() => {
    const fetchAuthUser = async () => {
      const data = await api({url: '/api/v1/users/me'})
      setAuthUser(data);
    }

    fetchAuthUser();
  }, [])

  return (
    <div className="contentWrapper">
      <BrowserRouter>
        <NavBar authUser={authUser} />
        <Switch>
          <Route exact path={URLS.USERS} component={Users} />
          <Route exact path={URLS.FUNDRAISERS} component={Fundraisers} />
          <Route exact path={URLS.PAYMENTS} component={Payments} />
          <Route exact path={URLS.ACHIEVEMENTS} component={Achievements} />
          <Route exact path={URLS.BOOKLISTS} component={BookLists} />
          <Route exact path={`${URLS.BOOKLISTS}/:id/books`} component={Books} />
          <Route exact path={`${URLS.BOOKLISTS}/:id/add`} component={Books} />
          <Route exact path={URLS.CONFIG} component={Config} />

          <Redirect to={URLS.FUNDRAISERS} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
