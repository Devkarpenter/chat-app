import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, MessageCircle, Send, Trash2, Users } from 'react-feather'
import { ID, Permission, Query, Role } from 'appwrite'
import client, { APPWRITE_DATABASE_CONFIGURED, COLLECTION_ID_MESSAGES, DATABASE_ID, databases } from '../appwriteConfig'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'

const formatTime = (value) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value))

const Room = () => {
  const [messageBody, setMessageBody] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(APPWRITE_DATABASE_CONFIGURED)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const getMessages = useCallback(async () => {
    if (!APPWRITE_DATABASE_CONFIGURED) return
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES, [Query.orderAsc('$createdAt'), Query.limit(100)])
      setMessages(response.documents)
      setError('')
    } catch (requestError) {
      setError(requestError?.message || 'Messages could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!APPWRITE_DATABASE_CONFIGURED) return undefined
    getMessages()
    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, (response) => {
      if (response.events.some((event) => event.endsWith('.create'))) {
        setMessages((current) => current.some((item) => item.$id === response.payload.$id) ? current : [...current, response.payload])
      }
      if (response.events.some((event) => event.endsWith('.delete'))) {
        setMessages((current) => current.filter((item) => item.$id !== response.payload.$id))
      }
    })
    return unsubscribe
  }, [getMessages])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const body = messageBody.trim()
    if (!body || !APPWRITE_DATABASE_CONFIGURED || sending) return
    setSending(true)
    setError('')
    try {
      const created = await databases.createDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, ID.unique(), { user_id: user.$id, username: user.name, body }, [Permission.write(Role.user(user.$id))])
      setMessages((current) => current.some((item) => item.$id === created.$id) ? current : [...current, created])
      setMessageBody('')
    } catch (requestError) {
      setError(requestError?.message || 'Your message could not be sent. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const deleteMessage = async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id)
      setMessages((current) => current.filter((message) => message.$id !== id))
    } catch (requestError) {
      setError(requestError?.message || 'That message could not be deleted.')
    }
  }

  const participantCount = useMemo(() => new Set(messages.map((message) => message.user_id)).size, [messages])

  return (
    <main className="app-shell">
      <div className="chat-window">
        <Header />
        <section className="room-heading">
          <div><span className="room-icon"><MessageCircle size={22} /></span><div><h1>Community lounge</h1><p>Open conversation for everyone</p></div></div>
          <span className="member-count"><Users size={16} /> {participantCount || 1} active</span>
        </section>

        {!APPWRITE_DATABASE_CONFIGURED && <div className="config-notice" role="alert"><AlertCircle size={19} /><div><strong>Database setup needed</strong><p>Add the Appwrite database and collection values to your .env file to enable messages.</p></div></div>}
        {error && <div className="notice notice-error room-error" role="alert">{error}<button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}

        <section className="messages" aria-live="polite">
          {loading && <div className="empty-state"><span className="loader" /><p>Loading conversation…</p></div>}
          {!loading && messages.length === 0 && <div className="empty-state"><span className="empty-icon"><MessageCircle size={26} /></span><h2>Start the conversation</h2><p>There are no messages yet. Say hello below.</p></div>}
          {messages.map((message) => {
            const owner = message.user_id === user.$id
            const canDelete = owner || message.$permissions?.includes(`delete("user:${user.$id}")`)
            return <article className={`message-row ${owner ? 'message-owner' : ''}`} key={message.$id}>
              {!owner && <span className="avatar message-avatar">{message.username?.trim()?.charAt(0)?.toUpperCase() || 'A'}</span>}
              <div className="message-content"><div className="message-meta"><strong>{owner ? 'You' : message.username?.trim() || `User-${message.user_id?.slice(0, 4)}`}</strong><time dateTime={message.$createdAt}>{formatTime(message.$createdAt)}</time>{canDelete && <button className="delete-button" type="button" onClick={() => deleteMessage(message.$id)} aria-label="Delete message"><Trash2 size={14} /></button>}</div><div className="message-bubble">{message.body}</div></div>
            </article>
          })}
        </section>

        <form className="composer" onSubmit={handleSubmit}>
          <div className="composer-input"><textarea required maxLength="250" rows="1" disabled={!APPWRITE_DATABASE_CONFIGURED || sending} aria-label="Message" placeholder="Write a message…" value={messageBody} onChange={(event) => setMessageBody(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit() } }} /><span>{messageBody.length}/250</span></div>
          <button className="send-button" type="submit" disabled={!messageBody.trim() || !APPWRITE_DATABASE_CONFIGURED || sending} aria-label="Send message">{sending ? <span className="button-loader" /> : <Send size={19} />}</button>
        </form>
      </div>
      <p className="app-caption">Nexus · Your community, connected</p>
    </main>
  )
}

export default Room
