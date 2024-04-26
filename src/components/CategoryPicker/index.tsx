import React from 'react'
import Dropdown, { DropdownProps } from '../Dropdown'
import { useSWRWrapper } from '@/store/custom'
import { isBlank } from '@/utils'

type Props = DropdownProps & {
  level?: string
}

const CategoryPicker = (props: Props) => {
  const { data } = useSWRWrapper<{ name: string, id: string }[]>(`/api/category${!isBlank(props.level) ? '?level=' + props.level : ''}`, {
    url: '/api/category',
    params: {
      ...!isBlank(props.level) && {
        level: props.level
      }
    },
    onSuccess(data){
      if(props.selected == null && data[0]?.id){
        props.onChange?.(data[0].id as string)
      }
    }
  })
  return (
    <Dropdown
      options={(data ?? []).map(item => ({ label: item.name, value: item.id as string }))}
      {...props}
    />
  )
}

export default CategoryPicker