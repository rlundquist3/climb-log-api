import { gql } from 'apollo-server-express';

export const climbTypes = gql`
  type Climb {
    id: ID! @id
    name: String!
    type: ClimbType
    grade: String
    createdAt: DateTime! @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
  }

  enum ClimbType {
    sport
    trad
    boulder
    alpine
    aid
    deepWaterSolo
  }
`;
