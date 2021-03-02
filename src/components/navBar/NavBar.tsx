import React from 'react';
import {Popconfirm} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import {NavLink} from "react-router-dom";

import {IUsersTableData} from '../../intarfaces/IUsers';
import {navigation} from '../../constants/Navigations';
import {accessTokenPath} from '../../constants/common';

import logo from "../../assets/images/logo_horizontal_white.svg";
import css from "./NavBar.module.scss"


interface IProps {
  authUser: IUsersTableData;
};

export function NavBar(props: IProps) {
  const {email} = props.authUser;

  const confirmLogout = () => {
    localStorage.setItem(accessTokenPath, "");
    window.location.reload();
  }

  return (
    <div className={css.navBarContainer}>
      <img className={css.logo} src={logo} alt="logo" />

      <div className={css.navContainer}>
        <div className={css.navButtons}>
          {navigation.map((item, id) => (
            <NavLink to={item.path} key={id} className={css.link} activeClassName={css.active}>
              {item.name}
            </NavLink>
          ))}
        </div>

        <Popconfirm
          className={css.logingContainer}
          title="Do you want to logout?"
          onConfirm={confirmLogout}>
          <div className={css.logout}>
            {email}
            {email && <CaretDownOutlined className={css.caret} />}
          </div>
        </Popconfirm>
      </div>
    </div>
  );
}
