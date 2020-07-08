import React from 'react';
import styled from 'styled-components';

const PassiveRow = styled.tr``;
const ActiveRow = styled.tr`
  td {
    background-color: green;
  }
`;

export default ({ expressions }) => {

  const maxValue = Object.values(expressions)
    .reduce((acc, v) => Math.max(acc, v), 0);

  const rows = Object.keys(expressions).map(key => {
    const value = expressions[key];
    const Row = (value === maxValue ? ActiveRow : PassiveRow);
    return (
      <Row>
        <td>{key}</td>
        <td>{value}</td>
      </Row>
    )
  });

  return (
    <table>
      <tbody>
        { rows }
      </tbody>
    </table>
  );
};
