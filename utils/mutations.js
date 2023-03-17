import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
 mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
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
          nutrients
        }
      }
      resetToken
      resetTokenExpiry
      currentVersion
      tokens
    }
  }
}
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation Mutation($password: String) {
  updateUserPassword(password: $password) {
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
        nutrients
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const UPDATE_USER = gql`
  mutation Mutation($username: String, $email: String) {
  updateUser(username: $username, email: $email) {
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
        nutrients
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const REQUEST_RESET = gql`
  mutation Mutation($email: String) {
  requestReset(email: $email) {
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
        nutrients
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const RESET_PASSWORD = gql`
  mutation Mutation($email: String, $password: String, $confirmPassword: String, $resetToken: String) {
  resetPassword(email: $email, password: $password, confirmPassword: $confirmPassword, resetToken: $resetToken) {
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
        nutrients
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const ADD_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!, $role: [String!], $tracker: String, $tokens: String) {
  addUser(username: $username, email: $email, password: $password, role: $role, tracker: $tracker, tokens: $tokens) {
    token
    user {
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
          nutrients
        }
      }
      resetToken
      resetTokenExpiry
      currentVersion
      tokens
    }
  }
}
`;


export const DELETE_USER = gql`
  mutation Mutation($deleteUserId: ID!) {
  deleteUser(id: $deleteUserId)
}
`;

export const ADD_ENTRY = gql`
mutation Mutation($date: String, $schedule: String, $item: String, $amount: String, $nutrients: String) {
  addEntry(date: $date, schedule: $schedule, item: $item, amount: $amount, nutrients: $nutrients) {
    _id
    date
    schedule
    item
    amount
    nutrients
  }
}
`;

export const UPDATE_TOKEN_COUNT = gql`
  mutation Mutation($userid: String, $remove: String, $add: String, $amount: String) {
  updateTokenCount(userid: $userid, remove: $remove, add: $add, amount: $amount) {
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
        nutrients
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;