import { useEffect, useState, useCallback } from "react"
import { getAccessToken } from "../managers/auth/msal"
import { fetchProfile, fetchPhotoUrl } from "../managers/auth/graph"

export default function useMsalUser() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [refetchTrigger, setRefetchTrigger] = useState(0)

	const refetch = useCallback(() => {
		setRefetchTrigger((prev) => prev + 1)
	}, [])

	useEffect(() => {
		let cancelled = false
		let revokePhotoUrl = () => {}

		const load = async () => {
			try {
				setLoading(true)
				setError(null)

				const token = await getAccessToken(["User.Read"], true)

				const [profile, photo] = await Promise.all([fetchProfile(token), fetchPhotoUrl(token)])

				revokePhotoUrl = photo.revoke

				if (!cancelled) {
					setUser({
						name: profile?.displayName || "Unbekannt",
						department: profile?.department || "KST Super Smarter Chatbot",
						avatarUrl: photo.url || null,
					})
				}
			} catch (e) {
				if (!cancelled) {
					setUser(null)
					setError(null)
				}
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()

		return () => {
			cancelled = true
			// Clean up object URL if we created one
			revokePhotoUrl()
		}
	}, [refetchTrigger])

	return { user, loading, error, refetch }
}
