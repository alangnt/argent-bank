import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectUser, updateUserProfile } from '../features/auth/authSlice'

function User() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  function startEditing() {
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
    setIsEditing(true)
  }

  async function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await dispatch(updateUserProfile({ firstName, lastName }))
    if (updateUserProfile.fulfilled.match(result)) {
      setIsEditing(false)
    }
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        {isEditing ? (
          <form className="edit-form" onSubmit={handleSave}>
            <h1>Edit user info</h1>
            <div className="input-wrapper">
              <input
                aria-label="First name"
                value={firstName}
                onChange={event => setFirstName(event.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <input
                aria-label="Last name"
                value={lastName}
                onChange={event => setLastName(event.target.value)}
              />
            </div>
            <div className="edit-actions">
              <button type="submit" className="edit-button">
                Save
              </button>
              <button
                type="button"
                className="edit-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>
              Welcome back
              <br />
              {user ? `${user.firstName} ${user.lastName}!` : '!'}
            </h1>
            <button className="edit-button" onClick={startEditing}>
              Edit Name
            </button>
          </>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  )
}

export default User
