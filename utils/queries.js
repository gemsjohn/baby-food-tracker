import { gql } from '@apollo/client';



export const GET_ME = gql`
  query Query {
  me {
    _id
    role
    username
    email
    story {
      _id
      userid
      chat {
        _id
        npc
        user
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    candidate
    storySummary
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
    story {
      _id
      userid
      chat {
        _id
        npc
        user
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    candidate
    storySummary
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
    story {
      _id
      userid
      chat {
        _id
        npc
        user
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    candidate
    storySummary
  }
}
`;

export const STORIES = gql`
  query Query($echo: String) {
  stories(echo: $echo) {
    _id
    userid
    chat {
      _id
      npc
      user
    }
  }
}
`;

