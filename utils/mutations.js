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
          time
          item
          amount
          emotion
          nutrients
          foodGroup
          allergy
        }
      }
      resetToken
      resetTokenExpiry
      currentVersion
      tokens
      allergy
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
    allergy
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
    allergy
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
    allergy
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
    allergy
  }
}
`;

export const ADD_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!, $role: [String!], $tracker: String, $tokens: String, $allergy: String) {
  addUser(username: $username, email: $email, password: $password, role: $role, tracker: $tracker, tokens: $tokens, allergy: $allergy) {
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
          time
          item
          amount
          emotion
          nutrients
          foodGroup
          allergy
        }
      }
      resetToken
      resetTokenExpiry
      currentVersion
      tokens
      allergy
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
  mutation Mutation($date: String, $schedule: String, $item: String, $amount: String, $nutrients: String, $emotion: String, $foodGroup: String, $time: String, $allergy: String) {
  addEntry(date: $date, schedule: $schedule, item: $item, amount: $amount, nutrients: $nutrients, emotion: $emotion, foodGroup: $foodGroup, time: $time, allergy: $allergy) {
    _id
    date
    schedule
    item
    amount
    nutrients
    foodGroup
    emotion
    time
    allergy
  }
}
`;

export const DELETE_ENTRY = gql`
  mutation Mutation($deleteEntryId: ID!) {
    deleteEntry(id: $deleteEntryId)
  }
`;

export const UPDATE_TOKEN_COUNT = gql`
  mutation Mutation($userid: String, $remove: String, $add: String, $amount: String, $emotion: String) {
  updateTokenCount(userid: $userid, remove: $remove, add: $add, amount: $amount, emotion: $emotion) {
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
    allergy
  }
}
`;

export const UPDATE_USER_ALLERGIES = gql`
mutation Mutation($item: String) {
  updateUserAllergies(item: $item) {
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    allergy
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;

export const SEND_PDFCONTENT = gql`
mutation Mutation($email: String, $html: String) {
  sendPDFContent(email: $email, html: $html) {
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
        time
        item
        amount
        emotion
        nutrients
        foodGroup
        allergy
      }
    }
    allergy
    resetToken
    resetTokenExpiry
    currentVersion
    tokens
  }
}
`;