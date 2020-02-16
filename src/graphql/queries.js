/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItemTable = /* GraphQL */ `
  query GetItemTable($itemID: Int!) {
    getItemTable(itemID: $itemID) {
      itemID
      category
      description
      images
      name
      postTime
    }
  }
`;
export const listItemTables = /* GraphQL */ `
  query ListItemTables(
    $filter: TableItemTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItemTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        itemID
        category
        description
        images
        name
        postTime
      }
      nextToken
    }
  }
`;
