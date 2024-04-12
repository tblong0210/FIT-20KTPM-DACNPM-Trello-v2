import React from 'react'
import { styled } from '@mui/material/styles'
import { faTrello } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Divider, Drawer } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '../Theme/themeContext'
import { faBoxArchive, faCheck, faCopy, faEye, faList, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import ChangeBackground from './ConponentMoreMenu/ChangeBackground'
import { BoardApiRTQ } from '~/api'

const drawerWidth = 320

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

const MoreMenu: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const url = window.location.href
  const workspaceIndex = url.indexOf('workspace/')
  const idsPart = url.substring(workspaceIndex + 'workspace/'.length)
  const [boardId] = idsPart.split('&')
  const { colors } = useTheme()
  const [isOpenChangeBg, setOpenBg] = React.useState(false)
  const [isWatching, setWatch] = React.useState<boolean>(true)
  // const [getBoardById, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  const [addWatcherToBoard] = BoardApiRTQ.BoardApiSlice.useAddWatcherMemberMutation()
  const [removeWatcherFromBoard] = BoardApiRTQ.BoardApiSlice.useRemoveWatcherMemberMutation()
  const [removeMemberInBoardByEmail] = BoardApiRTQ.BoardApiSlice.useRemoveMemberInBoardByEmailMutation()

  const handleChangeBgClose = () => {
    setOpenBg(false)
  }
  const handleChangeBgOpen = () => {
    setOpenBg(true)
  }

  const handleSetWatching = () => {
    setWatch(!isWatching)
    if (isWatching) addWatcherToBoard({ _id: boardId, email: 'nguyeenkieen141@gmail.com' })
    else removeWatcherFromBoard({ _id: boardId, email: 'nguyeenkieen141@gmail.com' })
  }

  const handleLeaveBoard = () => {
    removeMemberInBoardByEmail({ _id: boardId, email: 'nguyeenkieen141@gmail.com' })
      .then((response) => {
        // Kiểm tra nếu response trả về là đúng
        if (response) {
          // Điều hướng đến trang chủ
          window.location.href = 'http://localhost:3000/'
        } else {
          // Xử lý lỗi ở đây, ví dụ thông báo cho người dùng
          console.error('Có lỗi xảy ra:', response)
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.error('Có lỗi xảy ra khi gọi API:', error)
      })
  }

  React.useEffect(() => {
    // getBoardById(boardId).then((a) => {
    //   console.log(boardData?.data?.visibility[0])
    //   if (boardData?.data?.watcher_email.includes('nguyeenkieen141@gmail.com')) {
    //     setWatch(true)
    //   }
    // })
  })

  // const [activeItem, setActiveItem] = useState<string | null>(null)

  // const handleItemClick = (item: string) => {
  //   setActiveItem(item)
  // }

  return (
    <div style={{ position: 'relative' }}>
      <Drawer
        sx={{
          ...(open && { width: drawerWidth, paddingX: '20px' }),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '53px',
            color: colors.text,
            backgroundColor: colors.background
          },
          color: colors.text,
          backgroundColor: colors.background
        }}
        variant='persistent'
        anchor='right'
        open={open}
      >
        <DrawerHeader>
          <span className='text- w-[100%] rounded-md font-bold'>
            <div className='flex justify-center'>
              <h3>Menu</h3>
              <IoMdClose
                className='absolute right-3 cursor-pointer hover:text-gray-400'
                onClick={handleDrawerClose}
              ></IoMdClose>
            </div>
          </span>
        </DrawerHeader>
        <Divider />

        <Sidebar width='100%' className='overflow-hidden text-sm'>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faList} fontSize='small' className='mr-4' />
                Activity
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faBoxArchive} fontSize='small' className='mr-4' />
                Archived items
              </div>
            </MenuItem>
          </Menu>
          <Divider />
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
              // onClick={() => handleItemClick('boards')}
              onClick={handleChangeBgOpen}
            >
              <div className='flex items-center'>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundSize: 'cover',
                    borderRadius: '3px',
                    backgroundPosition: '50%',
                    marginRight: '10px',
                    backgroundImage: `url(${'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'})`
                  }}
                ></span>
                ChangeBackground
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faTrello} fontSize='small' className='mr-4' />
                Custom feilds
              </div>
            </MenuItem>
          </Menu>
          <Divider />
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center' onClick={handleSetWatching}>
                <FontAwesomeIcon icon={faEye} fontSize='small' className='mr-4' />
                Watch
                {isWatching ? <FontAwesomeIcon icon={faCheck} fontSize='small' className='ml-5 mr-4' /> : ''}
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faCopy} fontSize='small' className='mr-4' />
                Copy board
              </div>
            </MenuItem>
          </Menu>
          <Menu>
            <MenuItem
              className={`menu-item h-[50px] bg-[${colors.button}] text-[${colors.text}] hover:bg-[${colors.bg_button_hover}]`}
              // onClick={() => handleItemClick('boards')}
            >
              <div className='flex items-center' onClick={handleLeaveBoard}>
                <FontAwesomeIcon icon={faRightFromBracket} fontSize='small' className='mr-4' />
                Leave board
              </div>
            </MenuItem>
          </Menu>
        </Sidebar>
      </Drawer>
      <ChangeBackground open={isOpenChangeBg} handleDrawerClose={handleChangeBgClose} />
    </div>
  )
}

export default MoreMenu
