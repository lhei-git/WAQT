// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import Graphs from './graph';
import LineGraph from './line'
import Table from './current-table'

export function App() {
  return (
    <>
      <Graphs />
      <LineGraph />
      <Table />
      <div />
    </>
  );
}

export default App;
