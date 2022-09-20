import { Table,Header, HeaderRow, HeaderCell, Body, Row, Cell} 
from '@table-library/react-table-library/table';

const list = [
    {
      id: '1',
      name: 'VSCode',
      deadline: new Date(2020, 1, 17),
      type: 'SETUP',
      isComplete: true,
    },
    {
      id: '2',
      name: 'JavaScript',
      deadline: new Date(2020, 2, 28),
      type: 'LEARN',
      isComplete: true,
    },
    {
      id: '3',
      name: 'React',
      deadline: new Date(2020, 3, 8),
      type: 'LEARN',
      isComplete: false,
    }
  ];

  export const History_Table = () => {
    const data = { nodes: list };
  
    return (
      <Table data={data}>
        {(tableList) => (
          <>
            <Header>
                <HeaderRow>
                    <HeaderCell>Task</HeaderCell>
                    <HeaderCell>Deadline</HeaderCell>
                    <HeaderCell>Type</HeaderCell>
                    <HeaderCell>Complete</HeaderCell>
                </HeaderRow>
            </Header>
  
            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                  <Cell>{item['name']}</Cell>
                  <Cell>
                    {item['deadline'].toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }
                    )}
                  </Cell>
                  <Cell>{item['type']}</Cell>
                  <Cell>{item['isComplete'].toString()}</Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    );
  };
  export default History_Table