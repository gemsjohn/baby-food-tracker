import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
 mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      _id
      role
      username
      email
      resetToken
      resetTokenExpiry
      story {
        _id
        userid
        chat {
          _id
          npc
          user
        }
      }
      currentVersion
      candidate
      storySummary
    }
  }
}
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword($password: String) {
  updateUserPassword(password: $password) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser($username: String, $email: String) {
  updateUser(username: $username, email: $email) {
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

export const REQUEST_RESET = gql`
  mutation RequestReset($email: String) {
  requestReset(email: $email) {
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

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String, $password: String, $confirmPassword: String, $resetToken: String) {
  resetPassword(email: $email, password: $password, confirmPassword: $confirmPassword, resetToken: $resetToken) {
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

export const ADD_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!, $role: [String!], $story: String) {
  addUser(username: $username, email: $email, password: $password, role: $role, story: $story) {
    token
    user {
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
      tokens
    }
  }
}
`;

export const UPDATE_STORY_CONTENT = gql`
  mutation Mutation($candidate: String) {
  updateStoryContent(candidate: $candidate) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
  deleteUser(id: $deleteUserId)
}
`;

export const ADD_CHAT = gql`
mutation Mutation($npc: String, $user: String, $chapter: String) {
  addChat(npc: $npc, user: $user, chapter: $chapter) {
    _id
    npc
    user
  }
}
`;
export const DELETE_STORY = gql`
  mutation DeleteStory($deleteStoryId: ID!, $echo: String) {
  deleteStory(id: $deleteStoryId, echo: $echo)
}
`;

export const UPDATE_TOKEN_COUNT = gql`
  mutation UpdateTokenCount($userid: String, $remove: String, $add: String, $amount: String) {
    updateTokenCount(userid: $userid, remove: $remove, add: $add, amount: $amount) {
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
      tokens
    }
  }
`;