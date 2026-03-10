import { createContext, useContext, useState } from "react"

const TwoFAContext = createContext()

export const TwoFAProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const require2FA = (action) => {
    setPendingAction(() => action)
    setShowModal(true)
  }

const executeAction = async () => {
  try {
    if (pendingAction) {
      await pendingAction()
    }
    setPendingAction(null)
    setShowModal(false)
  } catch (err) {
    throw err
  }
}

  const cancel = () => {
    setPendingAction(null)
    setShowModal(false)
  }

  return (
    <TwoFAContext.Provider
      value={{
        showModal,
        require2FA,
        executeAction,
        cancel
      }}
    >
      {children}
    </TwoFAContext.Provider>
  )
}

export const use2FA = () => useContext(TwoFAContext)