/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMyType = `mutation CreateMyType(
  $input: CreateMyTypeInput!
  $condition: ModelMyTypeConditionInput
) {
  createMyType(input: $input, condition: $condition) {
    id
    title
    content
    price
    rating
  }
}
`;
export const updateMyType = `mutation UpdateMyType(
  $input: UpdateMyTypeInput!
  $condition: ModelMyTypeConditionInput
) {
  updateMyType(input: $input, condition: $condition) {
    id
    title
    content
    price
    rating
  }
}
`;
export const deleteMyType = `mutation DeleteMyType(
  $input: DeleteMyTypeInput!
  $condition: ModelMyTypeConditionInput
) {
  deleteMyType(input: $input, condition: $condition) {
    id
    title
    content
    price
    rating
  }
}
`;
