import React, { useState, useEffect } from 'react'
import { styled, useTheme as useMuiTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Button, Typography, Divider, Drawer } from '@mui/material'
import { faGear, faUserGroup, faTableCellsLarge, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { useTheme as useCustomTheme } from '~/components/Theme/themeContext'
import { Link, useParams, useLocation } from 'react-router-dom'
import { WorkspaceApiRTQ } from '~/api'
import { BoardApiRTQ } from '~/api'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { stringToColor } from '~/utils/StringToColor'
import { Board } from '@trello-v2/shared/src/schemas/Board'

const drawerWidth = 250

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  marginTop: 12
}))

interface Props {
  open: boolean
  handleDrawerClose: () => void
}

const SidebarCateWorkSpace: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const theme = useMuiTheme()
  const { colors } = useCustomTheme()
  const [getWorkspace, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetWorkspaceInfoQuery()
  const [getAllBoard, { data: boardRes }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByWorkspaceIdQuery()
  const [boardData, setBoardData] = useState<Board[]>()
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  useEffect(() => {
    setBoardData(boardRes?.data)
  }, [boardRes])
  const handleMouseEnter = (itemKey: string) => {
    setHoveredItem(itemKey)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const params = useParams()
  const location = useLocation()
  const workspaceId = params.workspaceId
  const boardId = params.boardId

  useEffect(() => {
    const targetPaths = [
      `/workspaceboard/${workspaceId}`,
      `/workspace/${workspaceId}/members`,
      `/workspaceSetting/${workspaceId}`,
      `/workspace/${workspaceId}/board/${boardId}`
    ]

    if (targetPaths.includes(location.pathname)) {
      setActiveItem(location.pathname)
    }

    if (workspaceId) {
      getWorkspace(workspaceId)

      getAllBoard({ workspaceId: workspaceId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, workspaceId])

  return (
    <div className='sidebar-cate-workspace' style={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '51px',
            backgroundColor: colors.background,
            color: colors.text
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center text-sm'>
              <Box
                sx={{
                  display: 'flex',
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    display: 'inline-block',
                    fontSize: '20px',
                    fontWeight: 700,
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: stringToColor(workspaceData?.data.name || ''),
                    width: '40px',
                    height: '40px',
                    textAlign: 'center',
                    color: colors.foreColor
                  }}
                >
                  {workspaceData?.data.name.charAt(0).toUpperCase()}
                </Typography>
              </Box>
              <div className='ml-2 cursor-pointer font-bold'>
                {workspaceData?.data.name}
                <div className='text-xs font-normal'>Free</div>
              </div>
            </div>
            <IconButton onClick={handleDrawerClose} sx={{ color: colors.text }}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
        </DrawerHeader>

        <Divider />

        <Box sx={{ paddingBottom: '50px' }}>
          <Sidebar className='text-sm'>
            <Menu>
              <Link to={`/workspaceboard/${workspaceId}`}>
                <MenuItem
                  className='menu-item rounded-md'
                  style={{
                    height: '40px',
                    backgroundColor:
                      hoveredItem === 'boards'
                        ? colors.bg_button_hover
                        : activeItem === `/workspaceboard/${workspaceId}`
                          ? colors.bg_button_active_hover
                          : colors.background
                  }}
                  onMouseEnter={() => handleMouseEnter('boards')}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-2' />
                    Boards
                  </div>
                </MenuItem>
              </Link>
              <Link to={`/workspace/${workspaceId}/members`}>
                <MenuItem
                  style={{
                    height: '40px',
                    backgroundColor:
                      hoveredItem === 'members'
                        ? colors.bg_button_hover
                        : activeItem === `/workspace/${workspaceId}/members`
                          ? colors.bg_button_active_hover
                          : colors.background
                  }}
                  onMouseEnter={() => handleMouseEnter('members')}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faUserGroup} fontSize='small' className='mr-2' />
                      Members
                    </div>
                  </div>
                </MenuItem>
              </Link>

              <Link to={`/workspaceSetting/${workspaceId}`}>
                <MenuItem
                  style={{
                    height: '40px',
                    backgroundColor:
                      hoveredItem === 'settings'
                        ? colors.bg_button_hover
                        : activeItem === `/workspace/${workspaceId}/workspaceSetting`
                          ? colors.bg_button_active_hover
                          : colors.background
                  }}
                  onMouseEnter={() => handleMouseEnter('settings')}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faGear} fontSize='small' className='mr-2' />
                    <div>Workspace settings</div>
                  </div>
                </MenuItem>
              </Link>
            </Menu>
          </Sidebar>

          <div className='flex w-full items-center justify-between'>
            <h2 className='text-ds-text my-2 overflow-hidden whitespace-nowrap pl-5 text-sm font-medium leading-6'>
              Workspace views
            </h2>
          </div>

          <Sidebar className='workspaces text-sm'>
            <div>
              <Menu>
                <MenuItem
                  className='menu-item'
                  style={{
                    height: '40px',
                    backgroundColor:
                      hoveredItem === 'table'
                        ? colors.bg_button_hover
                        : activeItem === `/table`
                          ? colors.bg_button_active_hover
                          : colors.background
                  }}
                  onMouseEnter={() => handleMouseEnter('table')}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faTableCellsLarge} fontSize='small' className='mr-2' />
                    Table
                  </div>
                </MenuItem>

                <MenuItem
                  className='menu-item'
                  style={{
                    height: '40px',
                    backgroundColor:
                      hoveredItem === 'calendar'
                        ? colors.bg_button_hover
                        : activeItem === `/calendar`
                          ? colors.bg_button_active_hover
                          : colors.background
                  }}
                  onMouseEnter={() => handleMouseEnter('calendar')}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <div className='flex items-center'>
                    <FontAwesomeIcon icon={faCalendarDays} fontSize='small' className='mr-2' />
                    Calendar
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </Sidebar>

          <div className='flex w-full items-center justify-between'>
            <h2 className='text-ds-text my-2 overflow-hidden whitespace-nowrap pl-5 text-sm font-medium leading-6'>
              Your boards
            </h2>
          </div>

          <Sidebar className='workspaces mb-10 text-sm'>
            <div>
              <Menu>
                {boardData?.map((board, index) => (
                  <Link key={index} to={`/workspace/${workspaceId}/board/${board._id}`}>
                    <MenuItem
                      className='menu-item'
                      style={{
                        height: '40px',
                        backgroundColor:
                          hoveredItem === board._id
                            ? colors.bg_button_hover
                            : activeItem === `/workspace/${workspaceId}/board/${board._id}`
                              ? colors.bg_button_active_hover
                              : colors.background
                      }}
                      onMouseEnter={() => handleMouseEnter(board._id || '')}
                      onMouseLeave={() => handleMouseLeave()}
                    >
                      <div className='flex items-center'>
                        <Box
                          sx={{
                            backgroundImage:
                              board.background.charAt(0) === 'h' ? `url("${board.background}")` : board.background,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '32px',
                            height: '24px',
                            borderRadius: '4px',
                            marginRight: '8px'
                          }}
                        ></Box>
                        {board.name}
                      </div>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </div>
          </Sidebar>
        </Box>

        <div
          className='border-grey-50 flex items-end justify-center border-t p-3'
          style={{
            zIndex: 100,
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            backgroundColor: colors.background
          }}
        >
          <Button
            className='flex w-full'
            sx={{
              backgroundImage:
                'linear-gradient(97.78deg, var(--ds-background-accent-purple-bolder, #5a3aad) 10.5%, var(--ds-background-accent-magenta-subtle, #c36dd1) 113.39%)',
              transition: 'background-color 0.3s',
              color: colors.white,
              fontSize: '0.8rem',
              alignItems: 'left',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundImage: 'linear-gradient(97.78deg, #1e3a8a 10.5%, #8e24aa 113.39%)'
              }
            }}
          >
            <FileUploadIcon className='mr-2' fontSize='small' />
            <div className='font-sans leading-5'>
              <span className='capitalize'>upgrade </span>
              <span className='lowercase'>to</span>
              <span className='capitalize'> premium</span>
            </div>
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default SidebarCateWorkSpace
