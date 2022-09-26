// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import LineGraph from './pm25'
import Table from './fire-info-table'

export function App() {
  return ( 
    <>
      <LineGraph />
      <Table />
    </>
  )
}

export default App;
