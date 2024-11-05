'use client'

import { EmptyState } from '@components/ui/empty-state'
import { CameraOutlined } from '@ant-design/icons'

import { EmptyProps } from '@definitions/index'

const Empty: React.FC<EmptyProps> = ({ icon, title, description, style = {} }) => {
  return <EmptyState {...style} icon={icon ?? <CameraOutlined />} title={title ?? ''} description={description ?? ''} />
}

export default Empty
