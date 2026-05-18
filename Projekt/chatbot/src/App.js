import "./App.css"
import { Layout } from "antd"
import Sidebar from "./components/Sidebar/Sidebar"
import MessageInput from "./components/MessageInput/MessageInput"
import MessageList from "./components/MessageList/MessageList"
import SiteHeader from "./components/SiteHeader/SiteHeader"
import useChatData from "./utils/useChatData"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState } from "react"
import useMsalUser from "./utils/useMsalUser"
import { getAccessToken } from "./managers/auth/msal"

const { Sider } = Layout

function App() {
	const {
		conversations,
		activeConversation,
		handleSend,
		handleUpload,
		isBotThinking,
		addConversation,
		switchConversation,
		deleteConversation,
		connected,
		loading,
	} = useChatData()

	const { user, loading: userLoading, refetch } = useMsalUser()
	const [collapsed, setCollapsed] = useState(true)
	const [loggingIn, setLoggingIn] = useState(false)

	const handleLogin = async () => {
		setLoggingIn(true)
		try {
			await getAccessToken()
			if (refetch) {
				await refetch()
			} else {
				window.location.reload()
			}
		} catch (error) {
			console.error("Login failed:", error)
			setLoggingIn(false)
		}
	}

	if (userLoading) {
		return (
			<div className="fullscreen-center">
				<div>Authentifizierung läuft...</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="fullscreen-center">
				<button
					onClick={handleLogin}
					disabled={loggingIn}
					className={`login-button ${loggingIn ? "disabled" : "enabled"}`}
				>
					{loggingIn ? "Anmeldung läuft..." : "Login"}
				</button>
			</div>
		)
	}

	return (
		<main className="pt-sans-regular">
			<Layout className="app-root">
				{!collapsed && (
					<Sider
						className="app-sider"
						theme="light"
						collapsible
						trigger={null}
					>
						<div className="sider-content">
							<Sidebar
								conversations={conversations}
								switchConversation={switchConversation}
								addConversation={addConversation}
								deleteConversation={deleteConversation}
								activeConversationId={activeConversation?.id}
								collapsed={collapsed}
								setCollapsed={setCollapsed}
							/>
						</div>
					</Sider>
				)}

				<div className="chat-column">
					<header className="chat-header">
						<SiteHeader
							user={user}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
						/>
					</header>

					<section className="message-scroll">
						<MessageList
							messages={activeConversation?.messages ?? []}
							isBotThinking={isBotThinking}
						/>
					</section>

					<footer className="chat-input">
						<MessageInput
							handleSend={handleSend}
							handleUpload={handleUpload}
							loading={loading || !connected}
							disabled={!connected}
							placeholder={connected ? "Schreibe eine Nachricht..." : "Verbindung wird hergestellt..."}
						/>
					</footer>
				</div>
			</Layout>

			<ToastContainer />
		</main>
	)
}

export default App
