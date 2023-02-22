import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'

import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'

import { fabricatorService, instance } from '../services/fabricator'
import { config } from '../utils/config'

const DBRecords = () => {
  const allUsers = useQuery({
    queryKey: ['all-users'],
    queryFn: fabricatorService.allUsersCount,
  })
  const definedUsers = useQuery({
    queryKey: ['defined-users'],
    queryFn: fabricatorService.unfabricatedUsersCount,
  })
  const fabricatedUsers = useQuery({
    queryKey: ['fabricated-users'],
    queryFn: fabricatorService.fabricatedUsersCount,
  })

  const allItems = useQuery({
    queryKey: ['all-items'],
    queryFn: fabricatorService.allItemsCount,
  })
  const definedItems = useQuery({
    queryKey: ['defined-items'],
    queryFn: fabricatorService.unfabricatedItemsCount,
  })
  const fabricatedItems = useQuery({
    queryKey: ['fabricated-items'],
    queryFn: fabricatorService.fabricatedItemsCount,
  })

  return (
    <>
      <Table striped bordered variant="dark" size="sm" className="my-2">
        <thead>
          <tr>
            <th>Count</th>
            <th>Generated</th>
            <th>Defined</th>
            <th>All</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Number of Users</td>
            <td>{fabricatedUsers?.data?.active_users}</td>
            <td>{definedUsers?.data?.active_users}</td>
            <td>{allUsers?.data?.active_users}</td>
          </tr>
          <tr>
            <td>Number of Items</td>
            <td>{fabricatedItems?.data?.item_count}</td>
            <td>{definedItems?.data?.item_count}</td>
            <td>{allItems?.data?.item_count}</td>
          </tr>
        </tbody>
      </Table>
      <small>
        *Generated: Auto-generated by initialization including requests by it.
      </small>
      <br />
      <small>
        *Defined: As in user-defined. Requests made by manually authenticated
        users and objects related to it.
      </small>
    </>
  )
}

export const Home = () => {
  const tokenMutation = useMutation({
    mutationFn: fabricatorService.tokenAuthLogin,
  })

  const location = useLocation()

  const auth_token = fabricatorService.getAuthToken()

  const handleInitial = async () => {
    try {
      if (auth_token) {
        const initObj = { name: 'init' }
        const initialize = await instance.post('/api/initial/', initObj)
        if (initialize) {
          localStorage.setItem('init', 'init')
          let timer
          timer = setTimeout(() => {
            window.location.reload()
            clearTimeout(timer)
          }, 2000)
          return initialize
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  React.useEffect(() => {
    if (location.pathname === '/' && !auth_token) {
      const obj = {
        username: config.fabricator_username,
        password: config.fabricator_password,
      }
      tokenMutation.mutate(obj)
      let timer
      timer = setTimeout(() => {
        window.location.reload()
        clearTimeout(timer)
      }, 2000)
    }
  }, [])

  if (tokenMutation.isLoading) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  const init = localStorage.getItem('init')

  return (
    <Stack>
      <h2>Home</h2>

      <div className="mt-3" style={{ marginBottom: '9rem' }}>
        {init ? (
          <div className="gap-2">
            <h3>DB Records</h3>
            <DBRecords />
            <div className="mt-3">
              <Alert variant="success">
                <h4>SHOP</h4>
                <p>
                  N.B. You accept our terms and conditions by navigating the
                  shop.
                </p>
                <hr />
                <div>
                  <div className="d-flex justify-content-end">
                    <LinkContainer to={'/shop'} className="mt-1">
                      <Button variant="success" size="lg">
                        Go To Shop
                      </Button>
                    </LinkContainer>
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h3>DB Records</h3>
              <DBRecords />
            </div>

            <div className="mt-3">
              <Alert variant="info">
                <h4>Initialize</h4>
                <p>
                  Auto-generate 6 new users and 30 new items. Delete all
                  previously system generated users, items and related objects.
                </p>
                <hr />
                <p className="mb-0">
                  If you ever use the generated users to authenticate and make
                  system requests, all records associated with those users will
                  be deleted. Initialisation has no effect on users who have
                  registered manually or who use social authentication.
                </p>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-info"
                    size="lg"
                    onClick={handleInitial}
                  >
                    START
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        )}
      </div>
    </Stack>
  )
}
