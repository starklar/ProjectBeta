/**
 * This file references code to interact with AWS congito from:
 * https://www.sammeechward.com/cognito-user-pool-react
 * 
 */

import { CognitoUserPool, CognitoUser, AuthenticationDetails, } from "amazon-cognito-identity-js"
import { cognitoConfig } from './AwsCognitoConfig';

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId,
})

export function signUp(username, email, password) {
    return new Promise((resolve, reject) => {
        userPool.signUp(
            username,
            password,
            [{ Name: "email", Value: email }],
            null,
            (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(result.user)
            }
        )
    })
}

export function confirmSignUp(username, code) {
    return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool,
        })

        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
}

export function signIn(username, password) {
    return new Promise((resolve, reject) => {
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        })

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool,
        })

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                resolve(result)
            },
            onFailure: (err) => {
                reject(err)
            },
        })
    })
}

export function signOut() {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
        cognitoUser.signOut()
    }
}

export function getSession() {
    const cognitoUser = userPool.getCurrentUser()
        return new Promise((resolve, reject) => {
        if (!cognitoUser) {
            reject(new Error("User not found"))
            return
        }
        cognitoUser.getSession((err, session) => {
            if (err) {
                reject(err)
                return
            }
            resolve(session)
        })
    })
}