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
    premium {
      status
      expiration
    }
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
      premium {
        status
        expiration
      }
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
      premium {
        status
        expiration
      }
      subuser {
        _id
        subusername
        allergy
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
            allergy
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
              servingWeight {
                amount
                unit
              }
            }
            foodGroup
            
          }
        }
        
        meal {
          _id
          title
        }
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
  query Foods {
    foods {
      _id
      item
      foodGroup
      nutrients {
        servingWeight {
          amount
          unit
        }
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
    }
  }
`;

export const GET_FOOD = gql`
  query Food($item: String) {
    food(item: $item) {
      _id
      item
      foodGroup
      nutrients {
        servingWeight {
          amount
          unit
        }
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
    }
  }
`;

