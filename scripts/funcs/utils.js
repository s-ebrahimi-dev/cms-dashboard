

const saveIntoLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.stringify(localStorage.getItem(key));
};

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("user"));

  return userInfo ? userInfo.token : null;
};

const isUserLogin = () => {
  const userInfos = localStorage.getItem("user");
  return userInfos ? true : false;
};

const getUrlParams = (key) => {
  const searchParam = window.location.search;
  const urlPrams = new URLSearchParams(searchParam);

  return urlPrams.get(key);
};

const searchInArray = (array, searchProperty, searchValue) => {
  let outputArray = array.filter((item) =>
    item[searchProperty].includes(searchValue),
  );
  return outputArray;
};

const paginateItems = (
  array,
  itemsPerPage,
  paginationParentElement,
  currentPage,
) => {
  let lastIndex = itemsPerPage * currentPage;
  let startIndex = lastIndex - itemsPerPage;
  let paginatedCount = Math.ceil(array.length / itemsPerPage);
  let paginateItems = array.slice(startIndex, lastIndex);
  paginationParentElement.innerHTML = "";
  const categoryName = getUrlParams("cat");
  for (let i = 1; i < paginatedCount + 1; i++) {
    paginationParentElement.insertAdjacentHTML(
      "beforeend",
      `
      <li class="courses__pagination-item">
              ${
                i === +currentPage
                  ? `
              <a onclick="addParamToUrl('page', ${i})" class="courses__pagination-link courses__pagination-link--active">
                ${i}
              </a>`
                  : `
              <a onclick="addParamToUrl('page', ${i})" class="courses__pagination-link">
              ${i}
              </a>`
              }
              
            </li>
      `,
    );
    // href=category.html?cat=${categoryName}&page=${i}
  }
  return paginateItems;
};

//* pagination button event handler way-3
const addParamToUrl = (param, value) => {
  let url = new URL(location.href);
  let searchParams = url.searchParams;
  searchParams.set(param, value);

  url.search = searchParams.toString();

  location.href = url.toString();
};

export {
  saveIntoLocalStorage,
  getFromLocalStorage,
  getToken,
  isUserLogin,
  getUrlParams,
  searchInArray,
  paginateItems,
  addParamToUrl,
};
