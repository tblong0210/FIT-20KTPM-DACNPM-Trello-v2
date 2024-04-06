import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TrelloApi } from '@trello-v2/shared'
import { token } from './getInfo'

interface InviteMembers2WorkspaceRequestWithId extends TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest {
  id: string | undefined
}

const WorkspaceApiSlice = createApi({
  reducerPath: 'WorkspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL_API,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
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
      query: () => ({
        url: '/api/workspace/all/lethuynga1662002@gmail.com',
        method: 'GET'
      })
    }),
    getAllUserWorkspace: builder.query<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse, void>({
      query: () => ({
        url: `/api/workspace/all`,
        method: 'GET'
      })
    }),
    getOwnerWorkspacebyEmail: builder.query<TrelloApi.WorkspaceApi.WorspaceResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/api/workspace/role/owner/${email}`,
        method: 'GET'
      })
    }),
    updateWorkspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest
    >({
      query: (data) => ({
        url: '/api/workspace',
        method: 'PUT',
        body: data
      })
    }),
    getWorkspaceInfo: builder.query<TrelloApi.WorkspaceApi.WorspaceResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/workspace/${id}`,
        method: 'GET'
      })
    }),
    inviteMember2Workspace: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      InviteMembers2WorkspaceRequestWithId
    >({
      query: (data) => {
        // Omit the id field from the data object
        const { id, ...requestData } = data
        console.log(id)
        console.log(requestData)
        return {
          url: `/api/workspace/invite/${id}`,
          method: 'POST',
          body: { ...requestData }
        }
      }
    }),
    changeWorkspaceVisibility: builder.mutation<
      TrelloApi.WorkspaceApi.WorspaceResponse,
      TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest
    >({
      query: (data) => ({
        url: `/api/workspace/visibility`,
        method: 'PUT',
        body: { ...data }
      })
    }),
    deleteWorkspace: builder.mutation<TrelloApi.WorkspaceApi.WorspaceResponse, { workspace_id: string }>({
      query: (data) => ({
        url: `/api/workspace/${data.workspace_id}`,
        method: 'DELETE'
      })
    })
  })
})

export { WorkspaceApiSlice }
