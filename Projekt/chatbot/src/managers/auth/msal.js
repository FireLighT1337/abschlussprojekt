import { PublicClientApplication } from "@azure/msal-browser"

// Configure via .env.local
const msalConfig = {
	auth: {
		clientId: process.env.REACT_APP_AZURE_CLIENT_ID, // e.g. SPA app client ID
		authority: process.env.REACT_APP_AZURE_AUTHORITY, // e.g. https://login.microsoftonline.com/<tenant_id>
		redirectUri: window.location.origin,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
}

const msalInstance = new PublicClientApplication(msalConfig)

export async function getAccessToken(scopes = [process.env.REACT_APP_AZURE_SCOPE], silentOnly = false) {
	await msalInstance.initialize()

	// Try to reuse an existing account
	const accounts = msalInstance.getAllAccounts()
	const account = accounts[0]

	const requestScopes = scopes.filter(Boolean)
	const request = {
		scopes: requestScopes.length > 0 ? requestScopes : ["User.Read"],
		account,
	}

	try {
		const result = await msalInstance.acquireTokenSilent(request)
		return result.accessToken
	} catch (silentErr) {
		if (silentOnly) {
			throw silentErr
		}

		// No cached session → interactive login + token
		const loginResult = await msalInstance.loginPopup({
			scopes: request.scopes,
			prompt: "select_account",
		})
		const tokenResult = await msalInstance.acquireTokenSilent({
			...request,
			account: loginResult.account,
		})
		return tokenResult.accessToken
	}
}

export async function getAccount() {
	await msalInstance.initialize()
	const accounts = msalInstance.getAllAccounts()
	return accounts[0] || null
}

export async function logout() {
	await msalInstance.initialize()
	const account = msalInstance.getAllAccounts()[0]
	if (!account) return
	await msalInstance.logoutPopup({ account, postLogoutRedirectUri: window.location.origin })
}
