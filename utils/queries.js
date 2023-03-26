import { gql } from '@apollo/client';



export const GET_ME = gql`
  query Query {
  me {
    _id
    role
    username
    email
    tracker {
      _id
      date
      entry {
        _id
        date
        schedule
        item
        amount
        emotion
        nutrients
        foodGroup
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const GET_USER_BY_ID = gql`
  query Query($id: ID!) {
  user(_id: $id) {
    _id
    role
    username
    email
    tracker {
      _id
      date
      entry {
        _id
        date
        schedule
        item
        amount
        emotion
        nutrients
        foodGroup
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const GET_USERS = gql`
  query Query($echo: String) {
  users(echo: $echo) {
    _id
    role
    username
    email
    tracker {
      _id
      date
      entry {
        _id
        date
        schedule
        item
        amount
        emotion
        nutrients
        foodGroup
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const TRACKERS = gql`
  query Query($echo: String) {
  trackers(echo: $echo) {
    _id
    date
    entry {
      _id
      date
      schedule
      item
      amount
      emotion
      nutrients
      foodGroup
    }
  }
}
`;

export const FOOD = gql`
  query Query {
    foods {
      _id
      item
      nutrients
      foodGroup
    }
  }
`;

