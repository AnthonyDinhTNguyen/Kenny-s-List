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
    }
  }
`;
