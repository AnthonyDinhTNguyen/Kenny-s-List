/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItemTable = /* GraphQL */ `
  subscription OnCreateItemTable(
    $itemID: String
    $category: String
    $description: String
    $highestBidder: String
    $images: [String]
  ) {
    onCreateItemTable(
      itemID: $itemID
      category: $category
      description: $description
      highestBidder: $highestBidder
      images: $images
    ) {
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
export const onUpdateItemTable = /* GraphQL */ `
  subscription OnUpdateItemTable(
    $itemID: String
    $category: String
    $description: String
    $highestBidder: String
    $images: [String]
  ) {
    onUpdateItemTable(
      itemID: $itemID
      category: $category
      description: $description
      highestBidder: $highestBidder
      images: $images
    ) {
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
export const onDeleteItemTable = /* GraphQL */ `
  subscription OnDeleteItemTable(
    $itemID: String
    $category: String
    $description: String
    $highestBidder: String
    $images: [String]
  ) {
    onDeleteItemTable(
      itemID: $itemID
      category: $category
      description: $description
      highestBidder: $highestBidder
      images: $images
    ) {
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
export const onCreateUserBidsTable = /* GraphQL */ `
  subscription OnCreateUserBidsTable(
    $ProductID: Int
    $Username: String
    $BidAmt: String
    $BidID: String
    $Status: String
  ) {
    onCreateUserBidsTable(
      ProductID: $ProductID
      Username: $Username
      BidAmt: $BidAmt
      BidID: $BidID
      Status: $Status
    ) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const onUpdateUserBidsTable = /* GraphQL */ `
  subscription OnUpdateUserBidsTable(
    $ProductID: Int
    $Username: String
    $BidAmt: String
    $BidID: String
    $Status: String
  ) {
    onUpdateUserBidsTable(
      ProductID: $ProductID
      Username: $Username
      BidAmt: $BidAmt
      BidID: $BidID
      Status: $Status
    ) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const onDeleteUserBidsTable = /* GraphQL */ `
  subscription OnDeleteUserBidsTable(
    $ProductID: Int
    $Username: String
    $BidAmt: String
    $BidID: String
    $Status: String
  ) {
    onDeleteUserBidsTable(
      ProductID: $ProductID
      Username: $Username
      BidAmt: $BidAmt
      BidID: $BidID
      Status: $Status
    ) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const onCreateLatestUserBidTable = /* GraphQL */ `
  subscription OnCreateLatestUserBidTable(
    $lubtProductID: String
    $Username: String
    $BidAmt: Float
  ) {
    onCreateLatestUserBidTable(
      lubtProductID: $lubtProductID
      Username: $Username
      BidAmt: $BidAmt
    ) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
export const onUpdateLatestUserBidTable = /* GraphQL */ `
  subscription OnUpdateLatestUserBidTable(
    $lubtProductID: String
    $Username: String
    $BidAmt: Float
  ) {
    onUpdateLatestUserBidTable(
      lubtProductID: $lubtProductID
      Username: $Username
      BidAmt: $BidAmt
    ) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
export const onDeleteLatestUserBidTable = /* GraphQL */ `
  subscription OnDeleteLatestUserBidTable(
    $lubtProductID: String
    $Username: String
    $BidAmt: Float
  ) {
    onDeleteLatestUserBidTable(
      lubtProductID: $lubtProductID
      Username: $Username
      BidAmt: $BidAmt
    ) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
