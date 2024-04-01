import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL_API }),
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.CreateWorspaceRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        body: data,
        method: 'POST'
      })
    }),
    getAllWorkspace: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, void>({
      query: () => {
        const token = JSON.parse(localStorage.getItem('data') || '').token
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Header Content-Type
        }
        return {
          url: '/api/workspace/',
          headers: headers,
          method: 'GET'
        }
      }
    })
  })
})

export { WorkspaceApiSlice }
