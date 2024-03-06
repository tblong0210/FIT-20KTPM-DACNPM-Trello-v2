import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Box, Grid } from '@mui/material'
import { colors } from '~/styles'
import CardMemberList from './CardMemberList'
import CardLabelList from './CardLabelList'
import CardNotification from './CardNotification'
import { useState } from 'react'
import CardDate from './CardDate'
import CardDescription from './CardDescription'
import CardSidebar from './CardSidebar'
import CardChecklist from './CardChecklist'
import CardActivity from './CardActivity'

export type _Feature_Checklist = {
  _id: string
  name: string
  type: string
  items: _Feature_Checklist_Item[]
}

export type _Feature_Checklist_Item = {
  _id: string
  name: string
  is_check: boolean
}

const checklist_1: _Feature_Checklist = {
  _id: '0',
  name: 'Front-end Boards Page',
  type: 'checklist',
  items: [
    { _id: '0', name: 'Component design', is_check: false },
    { _id: '1', name: 'State management', is_check: false },
    { _id: '2', name: 'Data fetching', is_check: false },
    { _id: '3', name: 'Event handling', is_check: false },
    { _id: '4', name: 'Testing', is_check: false },
    { _id: '5', name: 'Code review', is_check: false },
    { _id: '6', name: 'Pull request approved', is_check: false }
  ]
}

const checklist_2: _Feature_Checklist = {
  _id: '1',
  name: 'Front-end Card Detail Window',
  type: 'checklist',
  items: [
    { _id: '0', name: 'Component design', is_check: false },
    { _id: '1', name: 'State management', is_check: false },
    { _id: '2', name: 'Data fetching', is_check: false },
    { _id: '3', name: 'Event handling', is_check: false },
    { _id: '4', name: 'Testing', is_check: false },
    { _id: '5', name: 'Code review', is_check: false },
    { _id: '6', name: 'Pull request approved', is_check: false }
  ]
}

const checklists: _Feature_Checklist[] = [checklist_1, checklist_2]

export default function CardDetailWindow() {
  const windowBg = '#fff'
  const focusInputColor = '#0ff'

  const [isWatching, setIsWatching] = useState(false)

  const handleNotification = (newState: boolean) => {
    setIsWatching(newState)
  }

  const [allChecklists, setAllChecklists] = useState(checklists)

  return (
    <Box
      sx={{
        width: 768,
        height: 'fit-content',
        marginBottom: '80px',
        paddingBottom: '40px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        backgroundColor: windowBg
      }}
      className='m-auto rounded-2xl'
    >
      {/* START: Header */}
      <Box sx={{ width: '100%', height: 89, padding: '8px 0' }} className='flex flex-row'>
        <Box sx={{ width: 46 }}>
          <Box sx={{ padding: '14px 0 0 20px' }}>
            <FontAwesomeIcon icon={faCreditCard} style={{ color: colors.primary, width: 20, height: 20 }} />
          </Box>
        </Box>
        <Box sx={{ width: 660, padding: '6px 0' }}>
          <input
            type='text'
            style={{
              width: '100%',
              height: '37px',
              padding: '6px 10px',
              color: colors.primary
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = focusInputColor
            }}
            value='Soạn nội dung thuyết trình'
            onChange={() => {}}
            className='text-xl font-semibold'
          />
          <Box
            sx={{ height: '20px', padding: '0 0 0 10px', color: colors.secondary }}
            className='flex flex-row items-center text-sm'
          >
            <p style={{ marginRight: '4px' }}>in list</p>
            <p style={{ marginRight: '16px' }} className='cursor-pointer font-medium underline'>
              Doing
            </p>
            {isWatching && <FontAwesomeIcon icon={faEye} />}
          </Box>
        </Box>
        <Box sx={{ width: 52, padding: '14px 20px 0 0' }} className='flex justify-end'>
          <FontAwesomeIcon icon={faTimes} style={{ color: colors.primary, width: 20, height: 20 }} />
        </Box>
      </Box>
      {/* END: Header */}
      {/* START: Body */}
      <Grid container>
        <Grid item xs={9} sx={{ padding: '0 8px 8px 16px' }}>
          {/* START: Hero */}
          <div style={{ padding: '0 0 0 40px' }} className='flex flex-row flex-wrap gap-1'>
            <CardMemberList />
            <CardLabelList />
            <CardNotification isWatching={isWatching} setIsWatching={handleNotification} />
            <CardDate />
          </div>
          {/* END: Hero */}
          {/* START: Description */}
          <CardDescription />
          {/* END: Description */}
          {/* START: Checklist */}
          {allChecklists.map((checklist) => (
            <CardChecklist
              key={checklist._id}
              currentChecklist={checklist}
              allChecklists={allChecklists}
              setAllChecklists={setAllChecklists}
            />
          ))}
          {/* END: Checklist */}
          <CardActivity />
        </Grid>
        <Grid item xs={3} sx={{ padding: '0 16px 8px 8px' }}>
          <CardSidebar />
        </Grid>
      </Grid>
      {/* END: Body */}
    </Box>
  )
}
