import { DbSchemas } from '@trello-v2/shared'

interface Temp {
  card: DbSchemas.CardlistSchema.ICard
}

export interface Card {
  id: string
  list_id: string
  order: number
  name: string
  list_name: string
  watcher_email: Array<string>
  placeHolder: boolean
}
export const defaultCard = {
  id: '',
  list_id: '',
  order: 0,
  name: '',
  list_name: '',
  watcher_email: []
}
export interface CardComponentProps {
  card: Card
  setOpenCardSetting: (data: string) => void
}
export interface List {
  id: string
  board_id: number
  order: number
  name: string
  data: Card[]
}
export interface ListComponentProps {
  list: List
  setOpenCardSetting: (data: string) => void
}
export interface ListsComponentProps {
  lists: List[]
  setOpenCardSetting: (data: string) => void
}