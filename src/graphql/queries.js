/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItemTable = /* GraphQL */ `
  query GetItemTable($itemID: String!) {
    getItemTable(itemID: $itemID) {
      itemID
      category
      description
      highestBidder
      images
      itemOwner
      name
      postTime
      condition
      marketPrice
      startingBid
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
        highestBidder
        images
        itemOwner
        name
        postTime
        condition
        marketPrice
        startingBid
      }
      nextToken
    }
  }
`;
export const getUserBidsTable = /* GraphQL */ `
  query GetUserBidsTable($Username: String!, $ProductID: Int!) {
    getUserBidsTable(Username: $Username, ProductID: $ProductID) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const listUserBidsTables = /* GraphQL */ `
  query ListUserBidsTables(
    $filter: TableUserBidsTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserBidsTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ProductID
        Username
        BidAmt
        BidID
        Status
      }
      nextToken
    }
  }
`;
