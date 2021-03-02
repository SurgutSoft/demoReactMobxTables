import css from "./Loader.module.scss"
import {Spin} from 'antd';

export const Loader = () => (
  <div className={css.loaderContainer}>
    <Spin className={css.loader} size="large"/>
  </div>
)
