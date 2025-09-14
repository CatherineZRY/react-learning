import React, { useState } from 'react';
import { Button } from '@/components/Button';
import styles from './Home.module.css';
import { connect } from 'react-redux';
import { getHomeList } from './store/actions';

const Home: React.FC<{ list: any[]; getHomeList: () => void }> = (props: {
  list: any[];
  getHomeList: () => void;
}) => {
  const [count, setCount] = useState(0);
  const { list } = props;

  return (
    <div>
      <p style={{ color: 'red' }}>count: {count}</p>
      <div className={styles.btnWrapper}>
        <Button
          text="Increment"
          className={styles.btn}
          onClick={() => setCount(prev => prev + 1)}
        />
        <Button
          text="Decrement"
          className={styles.btn}
          onClick={() => setCount(prev => prev - 1)}
        />
        <Button
          text="Reset"
          className={styles.btn}
          onClick={() => setCount(0)}
        />
      </div>
      <div>
        <span>home list:</span>
        <ul>
          {list.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Button
          text="Get Home List"
          className={styles.btn}
          onClick={() => getHomeList()}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: { home: { newsList: any } }) => ({
  list: state.home.newsList,
});

const mapDispatchToProps = (dispatch: (arg0: any) => void) => ({
  getHomeList: () => {
    dispatch(getHomeList());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
