import { useState, useEffect, lazy, Suspense } from 'react'
import { List, Card } from './type/index'

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  UniqueIdentifier,
  PointerSensor,
  useSensor,
  useSensors,
  DragMoveEvent,
  Active,
  Over
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { cloneDeep, isEmpty } from 'lodash'
import { BoardLayout } from '../../layouts'
import { generatePlaceHolderCard } from '../../utils/fomatter'
import LoadingComponent from '../../components/Loading'
import { CardComponent, ListComponent } from './components'
import { CardApiRTQ, CardlistApiRTQ } from '../../api'
import { board_id } from '~/api/getInfo'
import { useParams } from 'react-router-dom'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
const LazyListsComponent = lazy(() => import('./components/Lists'))
const LazyCardDetailsComponent = lazy(() => import('~/components/CardDetailWindow'))
export function Board() {
  const [getCardListByBoardId, { data: cardlistDataByBoardId }] =
    CardlistApiRTQ.CardListApiSlice.useLazyGetCardlistByBoardIdQuery()
  const [moveCardAPI] = CardApiRTQ.CardApiSlice.useMoveCardMutation()
  const [moveListAPI] = CardlistApiRTQ.CardListApiSlice.useMoveCardListMutation()
  const [oldListWhenDragging, setOldListWhenDraggingCard] = useState<List>()
  const [listsData, setListsData] = useState<Array<List>>()
  const [activeDragItemId, setActiveDragItemId] = useState<string>('')
  const [activeDragItemType, setActiveDragItemType] = useState<string>('')
  const [activeDragItemData, setActiveDragItemData] = useState<any>()
  const [openCardSetting, setOpenCardSetting] = useState<string>('')
  const [resetManually, setResetManually] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card>()
  const params = useParams()
  const boardId = params.boardId

  const savedValuesString = localStorage.getItem('savedValues') ? localStorage.getItem('savedValues') : '[]'

  useEffect(() => {
    if (savedValuesString) {
      const savedValues: string[] = JSON.parse(savedValuesString)

      if (boardId) {
        const index = savedValues.indexOf(boardId)

        if (index !== -1) {
          const filteredValues = savedValues.filter((value) => value !== boardId)
          const updatedValues = [boardId, ...filteredValues]
          localStorage.setItem('savedValues', JSON.stringify(updatedValues))
        } else {
          const updatedValues = [boardId, ...savedValues]
          localStorage.setItem('savedValues', JSON.stringify(updatedValues))
        }
      }
    } else {
      localStorage.setItem('savedValues', JSON.stringify([]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId])

  const [action, setAction] = useState<boolean>(false)

  const setIndexToCards = (lists: List[]) => {
    return lists.map((list) => ({
      ...list,
      cards: list.cards
        .sort((a, b) => (a.index ?? Infinity) - (b.index ?? Infinity))
        .map((card, index) => ({
          ...card,
          index: index
        }))
    }))
  }

  useEffect(() => {
    if (!cardlistDataByBoardId) return

    const list_data = [...cardlistDataByBoardId.data]
    const updatedLists_placeHolder = list_data
      .sort((a, b) => (a.index ?? Infinity) - (b.index ?? Infinity))
      .map((list) => ({
        ...list,
        cards: list.cards.map(
          (card) =>
            ({
              ...card,
              list_id: list._id || '',
              placeHolder: false // Set your default value for placeHolder
            }) as Card
        )
      })) as List[]
    const updatedLists = updatedLists_placeHolder?.map((list) => {
      // Check if data array is empty
      if (
        list.cards.length === 0 ||
        list.cards.every((obj) => obj.archive_at !== null && obj.archive_at !== undefined)
      ) {
        // Add a new item to data array
        const newItem = generatePlaceHolderCard(list)
        return {
          ...list,
          cards: [newItem]
        }
      }
      return list
    })
    const setIndexToCard = setIndexToCards(updatedLists)
    setListsData(setIndexToCard)
  }, [cardlistDataByBoardId])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )
  async function getAllList() {
    // getAllCardlist()
    if (boardId) getCardListByBoardId({ id: boardId !== '123' ? boardId : board_id })
  }
  useEffect(() => {
    getAllList()

    // You can call your API update function here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId])

  function findListByCardId(cardId: string) {
    return listsData?.find((list) => list?.cards?.map((card) => card._id)?.includes(cardId))
  }
  function isCard(obj: Card): obj is Card {
    return 'cards' in obj == false
  }
  function handleMoveCardBetweenDifferenceColumn(
    isHandleDragEnd: boolean,
    overList: List,
    overCardId: UniqueIdentifier,
    active: Active,
    over: Over,
    activeList: List,
    activeDragingCardId: UniqueIdentifier,
    activeDraggingCardData: any
  ) {
    setListsData((prevList) => {
      const overCard = overList?.cards?.find((card) => card._id === overCardId)
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = (overCard?.index as number) >= 0 ? (isBelowOverItem ? 1 : 0) : isBelowOverItem ? 0 : -1

      const newCardIndex = (overCard?.index as number) + modifier
      const nextList = cloneDeep(prevList)
      const nextActiveList = nextList?.find((list) => list._id === activeList._id)
      const nextOverList = nextList?.find((list) => list._id === overList._id)

      if (nextActiveList) {
        nextActiveList.cards = nextActiveList.cards.filter((card) => card._id !== activeDragingCardId)
        nextActiveList.cards = nextActiveList.cards.map((card, index) => ({ ...card, index }))
        if (isEmpty(nextActiveList.cards)) {
          nextActiveList.cards = [generatePlaceHolderCard(nextActiveList)]
        }
      }
      if (nextOverList) {
        nextOverList.cards = nextOverList.cards.filter((card) => card._id !== activeDragingCardId)
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          list_id: nextOverList._id
        } as Card
        // Ensure activeDraggingCardData is not undefined before using it
        if (isCard(activeDraggingCardData)) {
          nextOverList.cards.splice(newCardIndex, 0, rebuild_activeDraggingCardData)
          nextOverList.cards = nextOverList.cards.map((element, index) => ({ ...element, index }))
          nextOverList.cards = nextOverList.cards.filter((card) => card.placeHolder === false)

          if (nextActiveList && nextOverList && oldListWhenDragging && isHandleDragEnd === true) {
            const activeCardIdArray = oldListWhenDragging.cards
              .map((card) => card._id)
              .filter((id) => id != activeDragingCardId)
            const overCardIdArray = nextOverList.cards.map((card) => card._id)
            moveCardAPI({
              data: {
                source_list: {
                  cardlist_id: oldListWhenDragging._id,
                  target_card_id: activeDragingCardId as string,
                  cards_id_index: activeCardIdArray
                },
                destination_new_list: {
                  cardlist_id: nextOverList._id,
                  cards_id_index: overCardIdArray
                }
              }
            })
          }
        }
      }
      // setOverListData(nextOverList)
      return nextList
    })
    getCardListByBoardId({ id: boardId })
  }
  function handleDragStart(e: DragStartEvent) {
    setActiveDragItemId(e?.active?.id.toString())
    setActiveDragItemType(e?.active?.data?.current?.list_id ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e?.active?.data?.current)

    if (e?.active?.data?.current?.list_id) {
      setOldListWhenDraggingCard(findListByCardId(e?.active?.id as string))
    }
  }

  function handleDragOver(e: DragMoveEvent) {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }
    const { active, over } = e
    if (!active || !over) {
      return
    }
    const {
      id: activeDragingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over

    const activeList = findListByCardId(activeDragingCardId as string)
    const overList = findListByCardId(overCardId as string)
    if (!activeList || !overList) {
      return
    }
    if (activeList._id !== overList._id) {
      handleMoveCardBetweenDifferenceColumn(
        false,
        overList,
        overCardId,
        active,
        over,
        activeList,
        activeDragingCardId,
        activeDraggingCardData
      )
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!active || !over) return
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDragingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      const activeList = findListByCardId(activeDragingCardId as string)
      const overList = findListByCardId(overCardId as string)
      if (!activeList || !overList || !oldListWhenDragging) {
        return
      }
      if (oldListWhenDragging._id !== overList._id) {
        handleMoveCardBetweenDifferenceColumn(
          true,
          overList,
          overCardId,
          active,
          over,
          activeList,
          activeDragingCardId,
          activeDraggingCardData
        )
      } else {
        const oldIndex = oldListWhenDragging.cards.findIndex((data) => data._id === activeDragItemId)
        const newIndex = overList.cards.findIndex((data) => data._id === overCardId)
        const newList = arrayMove(oldListWhenDragging.cards, oldIndex, newIndex)
        setListsData((prevList) => {
          const nextList = !prevList ? [] : [...prevList]

          const targetList = nextList?.find((list) => list._id === overList._id)
          if (targetList) {
            targetList.cards = newList
          }
          const activeCardIdArray = oldListWhenDragging.cards.map((card) => card._id)
          const overCardIdArray = overList.cards.map((card) => card._id).filter((id) => id !== overCardId)
          moveCardAPI({
            data: {
              source_list: {
                cardlist_id: oldListWhenDragging._id,
                target_card_id: activeDragingCardId as string,
                cards_id_index: activeCardIdArray
              },
              destination_new_list: {
                cardlist_id: overList._id,
                cards_id_index: overCardIdArray
              }
            }
          })
          return nextList
        })
        setAction(!action)
      }
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id && listsData) {
        const oldIndex = listsData?.findIndex((data) => data._id === active.id)
        const newIndex = listsData?.findIndex((data) => data._id === over.id)
        const newListsData = arrayMove(listsData, oldIndex, newIndex)
        const sortList = newListsData.map((list, index) => ({ ...list, index }))
        setListsData(sortList)
        const activeCardIdArray = sortList.map((list) => ({
          cardlist_id: list._id,
          index: list.index ?? 0 // Use 0 as the default index if it's nullish
        }))
        if (boardId)
          moveListAPI({
            board_id: boardId,
            cardlist_id_idx: activeCardIdArray
          }).then(() => {
            setAction(!action)
            getCardListByBoardId({ id: boardId })
          })
      }
    }

    setActiveDragItemId('')
    setActiveDragItemType('')
    setActiveDragItemData(null)
    setOldListWhenDraggingCard(undefined)
    // setOverListData(undefined)
  }
  const customDropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <BoardLayout openCardSetting={openCardSetting}>
      <div className={`relative flex flex-row justify-start`}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragMove={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {(listsData || []) && (
            <div className={`relative mt-[64px] w-[100%]`}>
              <Suspense fallback={<LoadingComponent />}>
                <LazyListsComponent
                  cardSelected={setSelectedCard}
                  lists={listsData || []}
                  resetManually={resetManually}
                  setResetManually={setResetManually}
                  setOpenCardSetting={setOpenCardSetting}
                />
              </Suspense>
              <DragOverlay dropAnimation={customDropAnimation}>
                {!activeDragItemId || !activeDragItemType}
                {activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
                  <ListComponent
                    index={0}
                    maxHeight={10}
                    list={activeDragItemData}
                    cardSelected={(defaultCard) => {}}
                    setResetManually={() => {}}
                    resetManually={false}
                    setOpenCardSetting={(data) => setOpenCardSetting(data)}
                  />
                )}
                {activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
                  <CardComponent
                    card={activeDragItemData}
                    cardSelected={(defaultCard) => {}}
                    setOpenCardSetting={(data) => setOpenCardSetting(data)}
                  />
                )}
              </DragOverlay>
            </div>
          )}
        </DndContext>
        {selectedCard && boardId && (
          <div className={`relative mt-[32px]`}>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyCardDetailsComponent
                cardId={selectedCard._id}
                cardlistId={selectedCard.list_id}
                isOpenCDW={true}
                handleCloseCDW={() => {
                  setSelectedCard(undefined)
                  getCardListByBoardId({ id: boardId })
                }}
                boardId={boardId}
              />
            </Suspense>
          </div>
        )}
      </div>
    </BoardLayout>
  )
}
