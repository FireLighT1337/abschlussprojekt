export async function fetchProfile(accessToken) {
	const res = await fetch("https://graph.microsoft.com/v1.0/me?$select=displayName,department", {
		headers: { Authorization: `Bearer ${accessToken}` },
	})
	if (!res.ok) throw new Error(`Graph /me failed ${res.status}`)
	return res.json()
}

/**
 * Fetches the user's profile photo (object URL or null if not available).
 * Also returns a cleanup function to revoke the URL later if you want.
 * Requires scope: 'User.Read'
 */
export async function fetchPhotoUrl(accessToken) {
	try {
		const res = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		if (!res.ok) return { url: null, revoke: () => {} }
		const blob = await res.blob()
		const url = URL.createObjectURL(blob)
		const revoke = () => URL.revokeObjectURL(url)
		return { url, revoke }
	} catch {
		return { url: null, revoke: () => {} }
	}
}
