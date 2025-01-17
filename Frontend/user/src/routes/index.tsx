import { Routes, Route } from 'react-router-dom'
import HomePage from '~/pages/Home'
import { AccountManagement, BoardsPage, ErrorPage } from '~/pages'
import { CategoryWorkspace } from '~/pages/CategoryWorkspace'
import PageMembers from '~/pages/Members'
import Login from '~/pages/Login'
import { WorkspaceSetting } from '~/pages/WorkspaceSetting'
import { WorkspaceBoardsPage } from '~/pages/WorkspaceBoardsPage'
import Layout from '~/layouts/Layout/layout'
import PrivateRoute from './privateRoute'
import { useContext } from 'react'
import { AuthContext } from '~/components/AuthProvider/AuthProvider'
import { useAppSelector } from '~/hooks'
import CardTemplate from '~/pages/Templates/component/CardTemplate'

export const Navigation = () => {
  const authContext = useContext(AuthContext)
  const valueToken = useAppSelector((state) => {
    return state.KC_TOKEN
  })
  const isLoggedIn = authContext?.isLoggedIn && valueToken !== undefined

  return (
    <Routes>
      <Route element={<PrivateRoute isAllowed={!isLoggedIn} redirectPath='/' />}>
        <Route path='/login' element={<Login />} />
      </Route>
      {isLoggedIn !== undefined && (
        <Route element={<PrivateRoute isAllowed={isLoggedIn || false} redirectPath='/login' />}>
          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/profile' element={<AccountManagement page={`profile`} />} />
            <Route path='/template' element={<CardTemplate />} />
            <Route path='/workspace/:workspaceId/board/:boardId' element={<CategoryWorkspace />} />
            <Route path='/boards/:id?' element={<BoardsPage />} />
            <Route path='/activity' element={<AccountManagement page={`activity`} />} />
            <Route path='/workspace/:workspaceId/members' element={<PageMembers />} />
            <Route path='/workspaceSetting/:workspaceId' element={<WorkspaceSetting />} />
            <Route path='/workspaceboard/:workspaceId' element={<WorkspaceBoardsPage />} />
          </Route>
        </Route>
      )}

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}
