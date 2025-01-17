import React, { useEffect, useState } from 'react'

import { useTheme } from '~/components/Theme/themeContext'

import InviteForm from './AddWorkspaceMembersForm'
import { Workspace } from '@trello-v2/shared/src/schemas/Workspace'
import LogoSection from './LogoSection'
import WorkspaceInfo from './WorkspaceInfo'
import EditForm from './EditForm'
import { WorkspaceApiRTQ } from '~/api'
import { UpdateWorkspaceInfoRequest } from '@trello-v2/shared/dist/src/api/WorkspaceApi'
import { useParams } from 'react-router-dom'
interface HeaderWpSetting {
  visibility: string | undefined
}

export const WorkspaceHeader: React.FC<HeaderWpSetting> = ({ visibility }) => {
  const { darkMode } = useTheme()
  const params = useParams()
  const workspaceId = params.workspaceId
  const [workspaceInfo, setWorkspaceInfo] = useState<Workspace>()
  const [visibilityState, setVisibilityState] = useState<string | undefined>('')
  const [getWorkspaceInfo, { data: workspaceInfoRes }] =
    WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetWorkspaceInfoQuery()
  const [resetWorkspaceManually, setResetWorkspaceManually] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [updateWorkspaceInfo] = WorkspaceApiRTQ.WorkspaceApiSlice.useUpdateWorkspaceMutation()
  const [formData, setFormData] = useState<UpdateWorkspaceInfoRequest>({
    _id: 'string',
    name: '123',
    short_name: 'string',
    description: 'string',
    website: 'string',
    logo: '',
    members: []
  })
  useEffect(() => {
    getWorkspaceInfo(workspaceId ? workspaceId : '')
  }, [resetWorkspaceManually])

  useEffect(() => {
    getWorkspaceInfo(workspaceId ? workspaceId : '')
  }, [workspaceId])
  useEffect(() => {
    setVisibilityState(visibility)
  }, [visibility])
  useEffect(() => {
    setWorkspaceInfo(workspaceInfoRes?.data)
    setFormData({
      _id: workspaceId,
      name: workspaceInfoRes?.data.name,
      short_name: workspaceInfoRes?.data.short_name,
      description: workspaceInfoRes?.data.description,
      website: workspaceInfoRes?.data.website,
      logo: workspaceInfoRes?.data.logo,
      members: workspaceInfoRes?.data.members
    })
  }, [workspaceInfoRes])
  const isFormValid = formData.name?.trim() !== '' && formData.short_name?.trim() !== ''
  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    updateWorkspaceInfo(formData).then(() => {
      setResetWorkspaceManually(!resetWorkspaceManually)
      setIsEditing(false)
    })
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  return (
    <header className={`relative mx-14  border-b-2 py-2  ${!darkMode ? 'border-gray-300  ' : 'border-gray-700 '} `}>
      <div className='my-4 flex max-w-2xl items-center space-x-4 pl-[10%]'>
        {!isEditing ? (
          <>
            <LogoSection name={workspaceInfo?.name} />
            <WorkspaceInfo
              workspaceName={workspaceInfo?.name}
              visibility={visibilityState}
              handleEditClick={handleEditClick}
            />
          </>
        ) : (
          <EditForm
            formData={formData}
            setFormData={setFormData}
            isFormValid={isFormValid}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
          />
        )}
      </div>
      <InviteForm workspace={workspaceInfo} />
    </header>
  )
}
