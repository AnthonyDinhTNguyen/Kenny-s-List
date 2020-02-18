/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItemTable = /* GraphQL */ `
  subscription OnCreateItemTable(
    $itemID: Int
    $category: String
    $description: String
    $images: [String]
    $name: String
  ) {
    onCreateItemTable(
      itemID: $itemID
      category: $category
      description: $description
      images: $images
      name: $name
    ) {
      itemID
      category
      description
      images
      name
      postTime
    }
  }
`;
export const onUpdateItemTable = /* GraphQL */ `
  subscription OnUpdateItemTable(
    $itemID: Int
    $category: String
    $description: String
    $images: [String]
    $name: String
  ) {
    onUpdateItemTable(
      itemID: $itemID
      category: $category
      description: $description
      images: $images
      name: $name
    ) {
      itemID
      category
      description
      images
      name
      postTime
    }
  }
`;
export const onDeleteItemTable = /* GraphQL */ `
  subscription OnDeleteItemTable(
    $itemID: Int
    $category: String
    $description: String
    $images: [String]
    $name: String
  ) {
    onDeleteItemTable(
      itemID: $itemID
      category: $category
      description: $description
      images: $images
      name: $name
    ) {
      itemID
      category
      description
      images
      name
      postTime
    }
  }
`;
