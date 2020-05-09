import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());

  // const userIds = _.uniq(_.map(getState().posts, "userId")); // use lodash library to go through all the user posts and pull off just unique userIds
  // userIds.forEach((id) => dispatch(fetchUser(id)));

  // recfactor above using lodash _.chain - allows us to chain on additonal fn to manipulate data.
  _.chain(getState().posts) // pass posts as arguement
    .map("userId") // the first arg is whatever it is chained onto so getState().posts is the first arg
    .uniq() // the results of the above is passed as the first arg 
    .forEach((id) => dispatch(fetchUser(id)))
    .value(); // this will execute the chain
};

export const fetchPosts = () => async (dispatch) => {
  const res = await jsonPlaceholder.get("/posts");

  dispatch({ type: "FETCH_POSTS", payload: res.data });
};

export const fetchUser = (id) => async (dispatch) => {
  const res = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: "FETCH_USER", payload: res.data });
};

// === Alternative method using memoize

// export const fetchUser = (id) => (dispatch) => {
//   _fetchUser(id, dispatch);
// };

// export const fetchUser = (id) => (dispatch) => _fetchUser(id, dispatch); //refactored from above

// // memoize so that it will only make 1 API call once, if it gets called again it will return previous data.
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const res = await jsonPlaceholder.get(`/users/${id}`);

//   dispatch({ type: "FETCH_USER", payload: res.data });
// });
