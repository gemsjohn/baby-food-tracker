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
  }
`;

export const ADD_USER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!, $role: [String!], $premium: Boolean, $subuser: [String]) {
    addUser(username: $username, email: $email, password: $password, role: $role, premium: $premium, subuser: $subuser) {
      token
      user {
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
  }
`;

export const UPDATE_USER = gql`
  mutation Mutation($username: String, $email: String) {
    updateUser(username: $username, email: $email) {
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

export const UPDATE_PREMIUM = gql`
  mutation Mutation($premium: Boolean) {
    updatePremium(premium: $premium) {
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

export const UPDATE_USER_PASSWORD = gql`
  mutation Mutation($password: String) {
    updateUserPassword(password: $password) {
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



export const REQUEST_RESET = gql`
  mutation Mutation($email: String) {
    requestReset(email: $email) {
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

export const RESET_PASSWORD = gql`
  mutation Mutation($email: String, $password: String, $confirmPassword: String, $resetToken: String) {
    resetPassword(email: $email, password: $password, confirmPassword: $confirmPassword, resetToken: $resetToken) {
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

export const DELETE_USER = gql`
  mutation Mutation($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const ADD_SUB_USER = gql`
  mutation Mutation($subusername: String) {
  addSubUser(subusername: $subusername) {
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
`;

export const UPDATE_USER_ALLERGIES = gql`
  mutation Mutation($subuserid: String, $item: String) {
    updateSubUserAllergies(subuserid: $subuserid, item: $item) {
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
`;

export const ADD_NUTRIENTS = gql`
  mutation Mutation($calories: String, $protein: String, $fat: String, $carbohydrates: String, $fiber: String, $sugar: String, $iron: String, $zinc: String, $omega3: String, $vitaminD: String) {
    addNutrients(calories: $calories, protein: $protein, fat: $fat, carbohydrates: $carbohydrates, fiber: $fiber, sugar: $sugar, iron: $iron, zinc: $zinc, omega3: $omega3, vitaminD: $vitaminD) {
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
  } 
`;

export const ADD_ENTRY = gql`
  mutation Mutation($subuserid: String, $date: String, $schedule: String, $time: String, $item: String, $amount: String, $emotion: String, $nutrients: [String], $foodGroup: String, $allergy: String) {
    addSubUserEntry(subuserid: $subuserid, date: $date, schedule: $schedule, time: $time, item: $item, amount: $amount, emotion: $emotion, nutrients: $nutrients, foodGroup: $foodGroup, allergy: $allergy) {
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
`;

export const DELETE_ENTRY = gql`
  mutation DeleteEntry($deleteEntryId: ID!, $subuserid: String) {
    deleteEntry(id: $deleteEntryId, subuserid: $subuserid)
  }
`;

export const DELETE_SUB_USER = gql`
  mutation Mutation($userid: ID!, $subuserid: ID!) {
    deleteSubUser(userid: $userid, subuserid: $subuserid)
  }
`;

export const ADD_FOOD = gql`
mutation Mutation($item: String, $nutrients: [String], $foodGroup: String) {
  addFood(item: $item, nutrients: $nutrients, foodGroup: $foodGroup) {
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

export const EDIT_FOOD = gql`
  mutation Mutation($foodid: String, $item: String, $nutritioncategory: String, $specificnutrientdetail: String, $foodGroup: String) {
    editFood(foodid: $foodid, item: $item, nutritioncategory: $nutritioncategory, specificnutrientdetail: $specificnutrientdetail, foodGroup: $foodGroup) {
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

export const DELETE_FOOD = gql`
  mutation Mutation($deleteFoodId: ID!) {
    deleteFood(id: $deleteFoodId)
  }
`;



export const SEND_PDFCONTENT = gql`
  mutation Mutation($email: String, $html: String) {
    sendPDFContent(email: $email, html: $html) {
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