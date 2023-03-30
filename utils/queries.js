import { gql } from '@apollo/client';



export const GET_ME = gql`
  query Me {
  me {
    _id
    role
    username
    email
    resetToken
    resetTokenExpiry
    currentVersion
    premium
    subuser {
      _id
      subusername
      tracker {
        _id
        date
        entry {
          _id
          subuserid
          date
          schedule
          time
          item
          amount
          emotion
          nutrients {
            calories {
              amount
              unit
            }
            protein {
              amount
              unit
            }
            fat {
              amount
              unit
            }
            carbohydrates {
              amount
              unit
            }
            fiber {
              amount
              unit
            }
            sugar {
              amount
              unit
            }
            iron {
              amount
              unit
            }
            zinc {
              amount
              unit
            }
            omega3 {
              amount
              unit
            }
            vitaminD {
              amount
              unit
            }
          }
          foodGroup
          allergy
        }
      }
      allergy
    }
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
      resetToken
      resetTokenExpiry
      currentVersion
      premium
      subuser {
        _id
        subusername
        tracker {
          _id
          date
          entry {
            _id
            subuserid
            date
            schedule
            time
            item
            amount
            emotion
            nutrients {
            calories {
              amount
              unit
            }
            protein {
              amount
              unit
            }
            fat {
              amount
              unit
            }
            carbohydrates {
              amount
              unit
            }
            fiber {
              amount
              unit
            }
            sugar {
              amount
              unit
            }
            iron {
              amount
              unit
            }
            zinc {
              amount
              unit
            }
            omega3 {
              amount
              unit
            }
            vitaminD {
              amount
              unit
            }
          }
            foodGroup
            allergy
          }
        }
        allergy
      }
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
      resetToken
      resetTokenExpiry
      currentVersion
      premium
      subuser {
        _id
        subusername
        tracker {
          _id
          date
          entry {
            _id
            subuserid
            date
            schedule
            time
            item
            amount
            emotion
            nutrients {
              calories
              protein
              fat
              carbohydrates
              fiber
              sugar
              iron
              zinc
              omega3
              vitaminD
            }
            foodGroup
            allergy
          }
        }
        allergy
      }
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
        subuserid
        date
        schedule
        time
        item
        amount
        emotion
        nutrients {
            calories {
              amount
              unit
            }
            protein {
              amount
              unit
            }
            fat {
              amount
              unit
            }
            carbohydrates {
              amount
              unit
            }
            fiber {
              amount
              unit
            }
            sugar {
              amount
              unit
            }
            iron {
              amount
              unit
            }
            zinc {
              amount
              unit
            }
            omega3 {
              amount
              unit
            }
            vitaminD {
              amount
              unit
            }
          }
        foodGroup
        allergy
      }
    }
  }
`;

export const FOOD = gql`
  query Query {
    foods {
      _id
      item
      nutrients {
            calories {
              amount
              unit
            }
            protein {
              amount
              unit
            }
            fat {
              amount
              unit
            }
            carbohydrates {
              amount
              unit
            }
            fiber {
              amount
              unit
            }
            sugar {
              amount
              unit
            }
            iron {
              amount
              unit
            }
            zinc {
              amount
              unit
            }
            omega3 {
              amount
              unit
            }
            vitaminD {
              amount
              unit
            }
          }
      foodGroup
    }
  }
`;

