import axios from 'axios';
import qs from 'qs';

import {accessTokenPath} from '../constants/common';
import {IAchievements} from '../intarfaces/IAchievements';
import {IBookListFilters, IBookLists, ISearchBooksFilter} from '../intarfaces/IBookLists';

export default function api(conf: any): Promise<any> {
  const config = conf;
  // "c11ec17d0b67bbb56d7877b61cfc9868b3ceef96" рабочий токен
  const accessToken = localStorage.getItem(accessTokenPath)
  console.log(config)
  config.headers = {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'};
  config.paramsSerializer = (params: object) => qs.stringify(
    params,
    {
      allowDots: true,
      arrayFormat: 'repeat',
    },
  );

  return axios(config)
    .then((response) => {
      if (response.status === 200 || response.status === 201 || response.status === 202) return response.data;

      return Promise.reject(response.data);
    })
    .catch((e) => {
      if (e?.request?.status === 401) {
        document.location.replace("https://rfms.pledgetree.com/log-in");
      }

      throw (e);
    });
};

class ApiClient {

  getPayments = (params: any) => api({url: "/api/v1/admin/payments", params});

  updateBeneficiary = (paymentId: number, userId: number) => {
    const form = new FormData();
    form.append('userId', userId+'');
    return api({method: 'PUT', url: `/api/v1/admin/payments/${paymentId}`, data: form})
  }

  getFundraisers = (params: any) => api({url: "/api/v1/admin/events", params});

}

export const apiClient = new ApiClient();

export const createAchievements = (data: IAchievements) => (
  api({
    method: "POST",
    url: "/api/v1/admin/achievements",
    data,
  })
);

export const updateAchievements = (data: IAchievements, editingData?: IAchievements) => (
  api({
    method: 'PUT',
    url: `/api/v1/admin/achievements/${data.id}`,
    data: JSON.stringify(editingData)
  })
);
export const moveAchievementTop = (id: number) => (
  api({method: 'PUT', url: `/api/v1/admin/achievements/${id}/top`})
);

export const moveAchievementEnd = (id: number) => (
  api({method: 'PUT', url: `/api/v1/admin/achievements/${id}/end`})
);

export const getAchievements = () => api({url: "/api/v1/admin/achievements"});

export const uploadAchImage = (file: any) => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);

  return api({
    method: "POST",
    url: "/api/v1/admin/achievements/image",
    data: bodyFormData,
  })
};

export const deleteAch = (id: number) => (
  api({
    method: "DELETE",
    url: `/api/v1/admin/achievements/${id}`
  })
);

//---book lists

export const getBookLists = (params: IBookListFilters) => api({url: "/api/v1/admin/books/lists", params});

export const createBookList = (data: IBookLists) => {
  const bodyFormData = new FormData();
  bodyFormData.append('title', data.title);
  bodyFormData.append('status', data.status);
  bodyFormData.append('minGrade', data?.minGrade?.toString() || "-3");
  bodyFormData.append('maxGrade', data?.maxGrade?.toString() || "12");

  return (
    api({
      method: "POST",
      url: "/api/v1/books/lists",
      data: bodyFormData,
    }))
};

export const updateBookList = (row: IBookLists) => {
  const bodyFormData = new FormData();
  bodyFormData.append('title', row.title);
  bodyFormData.append('status', row.status.toLowerCase());
  row.country !== "Any" && bodyFormData.append('country', row.country || "");
  bodyFormData.append('minGrade', row.minGrade?.toString() || "");
  bodyFormData.append('maxGrade', row.maxGrade?.toString() || "");

  return (
    api({
      method: "PATCH",
      url: `/api/v1/books/lists/${row.id}`,
      data: bodyFormData,
    }))
};

export const deleteBookList = (id: number) => (
  api({
    method: "DELETE",
    url: `/api/v1/books/lists/${id}`
  })
);

// ---books

export const getBooks = (id: string | number) => api({url: `/api/v1/books/lists/${id}`});

export const setUp = (idList: string | number, idBook: string | number) => (
  api({
    method: "PUT",
    url: `/api/v1/books/lists/${idList}/books/${idBook}/up`,
    data: {},
  })
);

export const setDown = (idList: string | number, idBook: string | number) => (
  api({
    method: "PUT",
    url: `/api/v1/books/lists/${idList}/books/${idBook}/down`,
    data: {},
  })
);

export const removeBook = (idList: string | number, isbn: string | number) => (
  api({
    method: "DELETE",
    url: `/api/v1/books/lists/${idList}/books/${isbn}`
  })
);

export const searchBooks = (params: ISearchBooksFilter) => api({url: "/api/v1/books/search", params});

export const addToList = (idList: string | number, isbn: string | number) => (
  api({
    method: "PUT", 
    url: `/api/v1/books/lists/${idList}/books/${isbn}`,
    data: {},
  })
)
