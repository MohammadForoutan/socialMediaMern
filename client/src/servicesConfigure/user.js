import http from './httpServer'
import config from './config.json'
import { ExpansionPanelDetails } from '@material-ui/core'


export const followUser =(userId) => {
  return http.put(`${config.api}/users/${userId}/follow`)
}

export const unfollowUser =(userId) => {
  return http.put(`${config.api}/users/${userId}/unfollow`) 
}

export const getFollowings = (userId) => {
  return http.get(`${config.api}/users/followings/${userId}`)
}

export const getSearchUser = (username) => {
  return http.get(`${config.api}/users/search/?username=${username}`)
}

export const getUserByUsername = (username) => {
  return http.get(`${config.api}/users/?username=${username}`)
}

export const updateUser = (userId, data) => {
  return http.put(`${config.api}/users/${userId}`, data)
}