import ReduxProvider from './redux/Provider'
import RouterProvider from './routes'

function App() {

  return (
    <>
      <ReduxProvider>
        <RouterProvider />
      </ReduxProvider>
    </>
  )
}

export default App
