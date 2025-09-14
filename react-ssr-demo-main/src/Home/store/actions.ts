import { CHANGE_LIST } from './constants';

//普通action
const changeList = (list: any[]) => ({
  type: CHANGE_LIST,
  list,
});
//异步操作的action(采用thunk中间件)
export const getHomeList = () => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const startIndex = Math.floor(Math.random() * 100);
        const endIndex = startIndex + 10;
        const list = [];
        for (let i = startIndex; i <= endIndex; i++) {
          list.push(i);
        }
        resolve({
          data: {
            data: list,
          },
        });
      }, 1000);
    }).then((res: any) => {
      const list = res.data.data;
      console.log(list);
      dispatch(changeList(list));
    });
  };
};
