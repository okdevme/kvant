'use client'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import type { Framework } from '@/lib/frameworks'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { fetchClient } from 'fumadocs-core/search/client/fetch'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { frameworks } from '@/lib/frameworks'
import { useFramework } from '@/lib/frameworks.client'
import { FrameworkIcon } from './framework-icon'

interface Item {
  name: string
  value: string | undefined
  framework?: Framework
}

const items: Item[] = [
  {
    name: 'All',
    value: undefined,
  },
  ...frameworks.map(framework => ({
    name: framework.title,
    value: framework.id,
    framework,
  })),
]

export default function DefaultSearchDialog({ open, onOpenChange, ...props }: SharedProps) {
  const framework = useFramework()
  const [tag, setTag] = useState<string | undefined>(framework.id)

  useEffect(
    () => {
      if (open)
        // eslint-disable-next-line react/set-state-in-effect
        setTag(framework.id)
    },
    [open, framework.id],
  )

  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({
      tag,
    }),
  })

  const [selectOpen, setSelectOpen] = useState(false)
  const selectedItem = items.find(item => item.value === tag) ?? items[0]

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={selectOpen} onOpenChange={setSelectOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">Framework</span>
              {selectedItem.framework && <FrameworkIcon id={selectedItem.framework.id} className="size-4" />}
              {selectedItem.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map(item => (
                <button
                  key={item.value}
                  onClick={() => {
                    setTag(item.value)
                    setSelectOpen(false)
                  }}
                  className={cn(
                    'rounded-lg text-start px-2 py-1.5 flex gap-2 items-center',
                    item.value === tag
                      ? 'text-fd-primary bg-fd-primary/10'
                      : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                  )}
                >
                  {item.framework && <FrameworkIcon id={item.framework.id} className="size-5" />}
                  <p className="font-medium">{item.name}</p>
                  {/* <p className="text-xs opacity-70">{item.description}</p> */}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
