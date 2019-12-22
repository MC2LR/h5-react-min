import React from 'react'
import Loadable from 'react-loadable';
const Loading = () => <div>Loading...</div>;

const UserInfo = Loadable({
  loader: () => import('@/pages/bind/UserInfo'),
  loading: Loading,
})
const Schedule = Loadable({
  loader: () => import('@/pages/query/Schedule'),
  loading: Loading,
})
const Contracts = Loadable({
  loader: () => import('@/pages/query/Contracts'),
  loading: Loading,
})
const Card = Loadable({
  loader: () => import('@/pages/query/Card'),
  loading: Loading,
})
const New = Loadable({
  loader: () => import('@/pages/query/New'),
  loading: Loading,
})
const Queries = Loadable({
  loader: () => import('@/pages/query/Queries'),
  loading: Loading,
})
const Prepayment = Loadable({
  loader: () => import('@/pages/service/Prepayment'),
  loading: Loading,
})
const Info = Loadable({
  loader: () => import('@/pages/service/Info'),
  loading: Loading,
})
const Charge = Loadable({
  loader: () => import('@/pages/service/Charge'),
  loading: Loading,
})
const Remittance = Loadable({
  loader: () => import('@/pages/service/Remittance'),
  loading: Loading,
})
const Update = Loadable({
  loader: () => import('@/pages/service/Update'),
  loading: Loading,
})
const Document = Loadable({
  loader: () => import('@/pages/service/Document'),
  loading: Loading,
})


const base = ''

const router = [
  {
    url: '/bind/UserInfo',
    component: UserInfo
  },
  {
    url: '/query/Schedule',
    component: Schedule
  },
  {
    url: '/query/Contracts',
    component: Contracts
  },
  {
    url: '/query/Card',
    component: Card
  },
  {
    url: '/query/New',
    component: New
  },
  {
    url: '/query/Queries',
    component: Queries
  },
  {
    url: '/service/Prepayment',
    component: Prepayment
  },
  {
    url: '/service/Info',
    component: Info
  },
  {
    url: '/service/Charge',
    component: Charge
  },
  {
    url: '/service/Remittance',
    component: Remittance
  },
  {
    url: '/service/Update',
    component: Update
  },
  {
    url: '/service/Document',
    component: Document
  }
]

export { base, router }
