import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoNewsHeaders = {
  "x-rapidapi-key": "a373320ba4msh8ffe000817d11a1p13a4ddjsn0ce920ad49c7",
  "x-rapidapi-host": "cryptocurrency-news2.p.rapidapi.com",
};

const baseUrl = "https://cryptocurrency-news2.p.rapidapi.com";

const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: () => createRequest("/v1/cryptodaily"),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
